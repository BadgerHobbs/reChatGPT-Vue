# reChatGPT

reChatGPT is an open-source, smooth ChatGPT interface, compatible with various OpenAI models such as GPT-3.5 Turbo and GPT-4. Built with the progressive Vue3 framework and styled with primerCSS, reChatGPT offers a customizable, responsive user experience.

![screen-recording gif](https://github.com/BadgerHobbs/reChatGPT-Vue/assets/23462440/a4799f5d-78de-4f13-b0c0-2c98d8ff3869)

## Features

- **Vue3:** Built using the progressive JavaScript framework Vue3, known for its efficiency and speed, ensuring a smooth and reactive user experience.
- **primerCSS Integration:** Aesthetically designed with primerCSS, GitHub's own CSS framework, providing a familiar and sleek user interface.
- **Support for OpenAI Models:** Flexible integration with multiple OpenAI language models, including GPT-3.5 Turbo and GPT-4.
- **Configurable Settings:** Customize your experience by selecting the AI model, adjusting the response time, and setting other preferences to suit your needs.
- **Multiple Themes:** Choose from a variety of themes to match your style or mood, or even create your own theme for a personal touch.
- **Responsive Design:** Enjoy a seamless experience across devices, whether you're on a desktop, tablet, or mobile.

## Getting Started

In order to start using reChatGPT, all that's required is an OpenAI API key. You can get this from your OpenAI developer account, which should charge you pay-as-you go for your usage (for average users this should cost less than the monthly subscription without the restrictions).

Once you have your API key, you can either go to [rechatgpt.badgerhobbs.com](https://rechatgpt.badgerhobbs.com) and start using reChatGPT or use the below instructions to start running your own instance. The applicaiton is a static website, so there is no back-end and everything happens locally excluding the processing by OpenAI.

## Development

To get a local copy up and running for development, follow the below steps.

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- NPM package manager

You will also need an OpenAI API key in order to use reChatGPT, so if you don't have one already go ahead and create one.

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/reChatGPT.git
    cd reChatGPT
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run local dev server**

    ```bash
    npm run dev
    ```

## Future Enhancements

- [ ] Improved error handling and warnings.
- [x] Exporting/Importing data as JSON.
- [ ] Renaming conversations.
- [ ] Improved mobile responsiveness.
- [x] Support for Azure OpenAI.

## License

The code and documentation in this project are released under the [GPLv3 License](LICENSE).
