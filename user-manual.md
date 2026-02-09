# How to use
this project `SQL-app` is a redirection project.
to create a new redirection:
1. Press the big green plus in the center of your screen.
2. Fill out the `Enter Text` field with a vaild url. the url has to be either http OR https, and it must repond with a `ok` when fetched by my server.
3. Press the `Create New Link` button. Your page will automaticly reload and in your dashboard will be a new a new redirection link.
4. Copy and share the link with who ever you like, when your ready comeback and see how many people actuly clicked the link.

# Notes
- The information on which links you create is stored in a cookie called `token` if you delete or loose the cookie you will no longer be able to view your link. they will still work you just cant see a dashboard with them. You could probly just go to /sql.db and look at the database your self since I haven't block it yet
- The redirection link checks for commom web crawlers like `Slackbot`, `Applebot`, `facebookexternalhit`, `Discordbot`, `Twitterbot`, `LinkedInBot`, and `WhatsApp` and then send back a `user_agent_block` message. Its not advanced and can be spoofed easily.

# Errors
- If you are unable to create a link make sure that link is returning a 200 and its js Request.ok is true.
