# Projects stack
- TypeScript
- Playwright
- Axios
- jimp

# High level structure
- .github/workflows - github workflow actions
- app_form - tests
- interfaces - interfaces that are used by tests
- pages - page object models
- test_data - static tests data
- utils - utils that are used by tests

# How to run
- VS Code is installed
- [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for VS Code is installed
- install axios (npm install axios)
- install jimp (npm install jimp)
- [install playwright](https://playwright.dev/docs/intro)
- [install git](https://git-scm.com/downloads)
- check out repo
- open in VS Studio and run via:
  - the 'Testing' menu OR
  - Terminal command: npx playwright test
- observer report: npx playwright show-report

https://github.com/AbyssalWhale/app_form_ts/assets/53709071/703c17cd-5ba2-4b00-8617-2702ef684e8d

# Issues
- alert with error messages when trying to submit a form without or invalid first name, last name, and email. I didn't manage to catch the alert since it was missing in the DOM;
- DOM structure should be improved on 'Form Submissions' page
- slider functionality should be improved since it can be easily passed;
- it's not clear regarding minimum and maximum sizes for first name, last name, and email;
- it's not clear regarding the requirements for the avatar:
  - resolution
  - size
  - format
 
# Bonus
- A basic pipeline is added. Create a Pull Request into main branch and observe tests are being executed; 


