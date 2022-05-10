export interface ArticleAuthor {
	name: String,
	pictureId?: String,
}

export interface Article {
	title: String,
	htmlTitle?: String,
	blurb: String,
	content: String,
	author: ArticleAuthor,
	pictureId?: String,
};
