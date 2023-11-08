# All of dominikriedig.de

This is the repository with all code for my express-managed webpages using a monolithic master process.

## Table of Contents

1. [Build, Start, Develop, Test, Debug](#build-start-develop-test-debug)
1. [Environment Variables](#environment-variables)

## Build, Start, Develop, Test, Debug

Following core npm scripts are useful when developing:

```bash
# Build and start the app
npm run build
npm start

# Start development environment
npm run dev

# Start debuggable development environment
npm run debug

# Run tests (Jest)
npm test
```

## Environment Variables

Here is a list of all impacting environment variables that can be used.
**Setting a variable to a unallowed value leads to undefined and
unexpected behaviours!**

<table>
	<thead>
			<th>Variable Name</th>
			<th>Default Value</th>
			<th>Allowed Values</th>
			<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<th>App behaviour settings</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
		<tr>
			<td>NODE_ENV</td>
			<td>-</td>
			<td>
				<code>production</code>,<br>
				<code>development</code>,
				<br><code>test</code>
			</td>
			<td>
				Changes database connection behaviour.
				Should not be set in <code>.env</code> file.
			</td>
		</tr>
		<tr>
			<td>
				DD_SUBAPP_PORT_<b>BLOG</b><br>
				DD_SUBAPP_PORT_<b>CMS</b><br>
				DD_SUBAPP_PORT_<b>CLOUDCENTER</b>
			</td>
			<td><code>true</code></td>
			<td>boolean</td>
			<td>Enables/disables a specific subapp.</td>
		</tr>
		<tr>
			<td>
				DD_SUBAPP_HOSTNAME_<b>BLOG</b><br>
				DD_SUBAPP_HOSTNAME_<b>CMS</b><br>
				DD_SUBAPP_HOSTNAME_<b>CLOUDCENTER</b>
			</td>
			<td><code>-</code></td>
			<td>string</td>
			<td>
				If <code>NODE_ENV</code> is <code>production</code>, prefixes all
				subapp-internal and cross-subapp <code>href</code>s with
				<code>https://&lt;HOSTNAME&gt;</code>, else this variable stays unused
				and the <code>href</code>s are prefixed with
				<code>http://localhost:port</code> instead.
			</td>
		</tr>
		<tr>
			<td>
				DD_SUBAPP_PORT_<b>BLOG</b><br>
				DD_SUBAPP_PORT_<b>CMS</b><br>
				DD_SUBAPP_PORT_<b>CLOUDCENTER</b>
			</td>
			<td>
				<code>3000</code><br>
				<code>3001</code><br>
				<code>3002</code>
			</td>
			<td>number</td>
			<td>
				Sets the port the subapp should listen on.
			</td>
		</tr>
		<tr>
			<th>Database connection settings</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
		<tr>
			<td>
				DD_DBHOST<br>
			</td>
			<td>
				<code>127.0.0.1</code>
			</td>
			<td>string</td>
			<td>
				Sets the database host to connect to.
			</td>
		</tr>
		<tr>
			<td>
				DD_DBUSER<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Sets the database username.
			</td>
		</tr>
		<tr>
			<td>
				DD_DBPASS<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Sets the database password.
			</td>
		</tr>
		<tr>
			<td>
				DD_DBNAME<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Sets the database name.
			</td>
		</tr>
		<tr>
			<th>Email Settings</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
		<tr>
			<td>
				DD_EMAIL_ENABLED<br>
			</td>
			<td><code>false</code></td>
			<td>boolean</td>
			<td>
				Enables email send functionality. If this is true, all other email related fields must be filled accordingly.
			</td>
		</tr>
		<tr>
			<td>
				DD_EMAIL_SMTP_SERVER<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Sets the SMTP Server host to send emails from.
			</td>
		</tr>
		<tr>
			<td>
				DD_EMAIL_SMTP_PORT<br>
			</td>
			<td>465</td>
			<td>number</td>
			<td>
				Sets the SMTP port to connect to.
			</td>
		</tr>
		<tr>
			<td>
				DD_EMAIL_SMTP_USERNAME<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Set the authenticating username for the SMTP Server.
			</td>
		</tr>
		<tr>
			<td>
				DD_EMAIL_SMTP_PASSWORD<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Set the authentication password for the SMTP Server.
			</td>
		</tr>
		<tr>
			<td>
				DD_EMAIL_FROM<br>
			</td>
			<td>-</td>
			<td>string</td>
			<td>
				Sets the default <code>From:</code> Email-Header. If not set, the SMTP Server might choose the default mail address as the <code>From</code> value or might not work at all, depending on the mail provider.
			</td>
		</tr>
		<tr>
			<th>Variables for internal use only</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
		<tr>
			<td>TW_COMPILE_SUBAPP_NAME</td>
			<td>-</td>
			<td>string</td>
			<td>
				Only used internally within tailwind-compiling npm scripts.
				<b>Do never set this!</b>
			</td>
		</tr>
	</tbody>
</table>
