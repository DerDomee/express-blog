# All of dominikriedig.de

This is the repository with all code for my express-managed webpages using a monolithic master process.

## Table of Contents

1. [Environment Variables](#environment-variables)

## Environment Variables

Here is a list of all impacting environment variables that can be used.
**Setting a variable to a unallowed value leads to undefined and unexpected behaviours!**

|                Variable Name | Default Value |           Allowed Values            | Description                                                                                                                                              |
| ---------------------------: | :-----------: | :---------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                     NODE_ENV |       -       | `production`, `development`, `test` | Changes database connection behaviour. Should not be set in `.env`.                                                                                      |
|        DD\_**BLOG**\_ENABLED |    `true`     |               boolean               | Enables/disables the express sub-app for the blog                                                                                                        |
|           DD\_**BLOG**\_PORT |    `3000`     |                Port                 | Sets the port for the blog                                                                                                                               |
|           DD\_**BLOG**\_HOST |       -       |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the blog with the set host. Else prefix them with `http://localhost:port`        |
|         DD\_**CMS**\_ENABLED |    `true`     |               boolean               | Enables/disables the express sub-app for the cms                                                                                                         |
|            DD\_**CMS**\_PORT |    `3001`     |                Port                 | Sets the port for the CMS                                                                                                                                |
|            DD\_**CMS**\_HOST |       -       |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the cms with the set host. Else prefix them with `http://localhost:port`         |
| DD\_**CLOUDCENTER**\_ENABLED |    `true`     |               boolean               | Enables/disables the express sub-app for the cloudcenter                                                                                                 |
|    DD\_**CLOUDCENTER**\_PORT |    `3002`     |                Port                 | Sets the port for the cloudcenter                                                                                                                        |
|    DD\_**CLOUDCENTER**\_HOST |       -       |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the cloudcenter with the set host. Else prefix them with `http://localhost:port` |
|       TW_COMPILE_SUBAPP_NAME |       -       |               String                | Only used internally within tailwind-compiling npm scripts. **Do never set this!**                                                                       |
