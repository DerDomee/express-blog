import {Sequelize} from 'sequelize';
import logger from '../logger';
import crypto from 'crypto';

import {
	Revision,
	initModel as revisionInit} from './dbmodels/revision.model';
import {
	BlogArticle,
	initModel as blogarticleInit} from './dbmodels/blogarticle.model';
import {
	User,
	initModel as userInit} from './dbmodels/user.model';
import {
	UserGroup,
	initModel as userGroupInit} from './dbmodels/usergroup.model';
import {
	LoginSession,
	initModel as loginSessionInit} from './dbmodels/loginsession.model';

export type allowedEnvs = 'development' | 'test' | 'production'

export const createInstance = async (NODE_ENV: allowedEnvs) => {
	let sequelizeInstance = undefined;
	switch (NODE_ENV) {
	case 'development':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './development_db.sqlite',
			logging: (...msg) => logger.debug,
		});
		break;
	case 'test':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './test_db.sqlite',
			logging: false,
		});
		break;
	case 'production':
		sequelizeInstance = new Sequelize(
			process.env.DD_DBNAME,
			process.env.DD_DBUSER,
			process.env.DD_DBPASS,
			{
				dialect: 'mysql',
				logging: false,
			});
		break;
	default:
		throw new RangeError(`NODE_ENV is of an invalid state: '${NODE_ENV}'`);
	}
	return sequelizeInstance;
};

export const loadModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	revisionInit(sequelizeInstance);
	blogarticleInit(sequelizeInstance);
	userInit(sequelizeInstance);
	userGroupInit(sequelizeInstance);
	loginSessionInit(sequelizeInstance);

	// Blog Article points to its latest revision (and back)
	BlogArticle.belongsTo(Revision);
	Revision.hasOne(BlogArticle);

	// Revision points to its prior revision (but not back to prevent cyclic deps)
	Revision.hasOne(Revision);

	// User points to all of his groups (and group points back)
	User.hasMany(UserGroup);
	UserGroup.belongsTo(User);

	// User points to all of his login sessions (and sessions point back to him)
	User.hasMany(LoginSession);
	LoginSession.belongsTo(User);
};

export const syncModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	await sequelizeInstance.sync({
		alter: NODE_ENV==='development' ? true : false,
		force: NODE_ENV==='development' ? true : false,
		logging: NODE_ENV==='development' ? false : false,
	});
};

const doSomeTests = async (sequelize: Sequelize) => {
	try {
		const revision = await Revision.create({
			revision_id: crypto.pseudoRandomBytes(8).toString('hex'),
			revision_prev_revision: null,
			revision_content: JSON.stringify({
				title: 'Blogtitel',
				htmlTitle: 'HTML-Titel des Blogs',
				blurb: 'Vorschautext (zu Testzwecken)',
				content:
`
# First Markdown content

Testing the integrated markdown parser

| col1          |   col2       |    col3       |    col4         |    col5 |
|:-----:        |:-------:     |:-------:      |:-------:        |:-------:|
| 100           | [a][1]       | ![b][2]       | ![b][2]         | ![b][2] |
| *Langer Text* | **Fooooooo** | ~~Baaaaaaar~~ | ~~Bazzzzzzzzz~~ | YIKES   |

## Integrated code block renderer with code highlighting

\`\`\`python
#!/bin/python3

# This is a very important comment.
this = 'Hello, world!'
print(this, end='')
result = foo(start=None, end={key1:'value1', key2: [0, 1, 2, 3], key3: 2})
if result == bar('test'):
    baz()

def main():
    baz();

if __name__ == "__main__":
    main()

\`\`\`

\`\`\`bash
npm i
npm run build
npm start
\`\`\`
`,
			}),
		});
		await BlogArticle.create({
			article_url_id: 'first-blog-hello-world',
			RevisionRevisionId: revision.revision_id,
			article_original_publication_time: Date.now() - (60 * 1000),
			article_last_update_time: Date.now(),
			article_is_published: true,
		});
	} catch (err) {
		throw err;
	}
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await loadModels(sequelize, NODE_ENV);
	await syncModels(sequelize, NODE_ENV);
	await doSomeTests(sequelize);

	return sequelize;
};