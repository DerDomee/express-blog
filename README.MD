# All of dominikriedig.de

This is the repository with all code for my express-managed webpages.

## Table of Contents

1. [Environment Variables](#environment-variables)

## Environment Variables

Here is a list of all impacting environment variables that can be used.
**Setting a variable to a unallowed value leads to undefined and unexpected behaviours!**

|                Variable Name |             Default Value              |           Allowed Values            | Description                                                                                                |
| ---------------------------: | :------------------------------------: | :---------------------------------: | :--------------------------------------------------------------------------------------------------------- |
|                     NODE_ENV |                   -                    | `production`, `development`, `test` | Changes database connection behaviour. Should not be set in `.env`.                                        |
|        DD\_**BLOG**\_ENABLED |                 `true`                 |               boolean               | Enables/disables the express sub-app for the blog                                                          |
|           DD\_**BLOG**\_PORT |                 `3000`                 |                Port                 | Sets the port for the blog                                                                                 |
|           DD\_**BLOG**\_HOST |       `https://dominikriedig.de`       |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the blog with the set host.        |
|         DD\_**CMS**\_ENABLED |                 `true`                 |               boolean               | Enables/disables the express sub-app for the cms                                                           |
|            DD\_**CMS**\_PORT |                 `3001`                 |                Port                 | Sets the port for the CMS                                                                                  |
|            DD\_**CMS**\_HOST |     `https://cms.dominikriedig.de`     |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the cms with the set host.         |
| DD\_**CLOUDCENTER**\_ENABLED |                 `true`                 |               boolean               | Enables/disables the express sub-app for the cloudcenter                                                   |
|    DD\_**CLOUDCENTER**\_PORT |                 `3002`                 |                Port                 | Sets the port for the cloudcenter                                                                          |
|    DD\_**CLOUDCENTER**\_HOST | `https://cloudcenter.dominikriedig.de` |               String                | If `NODE_ENV` is `production`, prefixes all cross-app links pointing to the cloudcenter with the set host. |
