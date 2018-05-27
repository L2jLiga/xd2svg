## How to contribute to xd2svg
   I'm really glad you're reading this, because this project need volunteer developers to help release functionality which would convert any Adobe XD files to SVG images.

### Contributing reasons

#### Did you find a bug?

   + Check [Issues](https://github.com/L2jLiga/xd2svg/issues) and make sure that the bug was not reported yet.

   + If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/L2jLiga/xd2svg/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

   + Use labels for your issue, if you don't know about issues, please, read [Labeling issues and pull requests](https://help.github.com/articles/labeling-issues-and-pull-requests/) articles

   + If possible, use the bug report templates to create the issue.

#### Did you write a patch that fixed bug?

   + Open a new GitHub pull request with the patch and add appropriate label.

#### Did you fix whitespace, format code, or make a purely cosmetic patch?

   I guess in most cases this pull will not be accepted

#### Do you intend to add a new feature or change an existing one?

   1. Check [Issues](https://github.com/L2jLiga/xd2svg/issues) and [Pull Requests](https://github.com/L2jLiga/xd2svg/pulls) and make sure that this feature are not implementing by anything yet
   2. Create new Issue with title `Feature/<name-of-feature>` and describe it
   3. Implement function in your own branch and send a pull request

#### Do you have questions about the source code?

   1. Try to find this question in [Issues](https://github.com/L2jLiga/xd2svg/issues?utf8=✓&q=label%3A"help%20wanted"%20%20label%3A"good%20first%20issue")
   2. If you didn't find related issue you can create new one with you question and appropriate label

### Submitting changes
   Please send a [GitHub Pull Request to xd2svg](https://github.com/L2jLiga/xd2svg/pull/new/master) with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

   Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

   ```shell
    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."
   ```

### Coding conventions
The code must pass the eslint check, used rules:

Basic
   + eslint:recommend
   + eslint-config-nodejs
   + eslint-config-google

Custom
   + Maximal line length = 160
   + Allow to use `console`
