/**
 * Settings object.
 */
export default class Settings {
	// reChatGPT Settings
	apiKey: string | null;
	theme: string | null;
	systemMessage: string | null;

	// OpenAI Chat API Settings
	frequencyPenalty: number | null;
	logitBias: Map<string, any> | null;
	maxTokens: number | null;
	model: string | null;
	n: number | null;
	presencePenalty: number | null;
	responseFormat: Map<string, string> | null;
	seed: number | null;
	stop: string | Array<string> | null;
	stream: string | null;
	temperature: number | null;
	toolChoice: string | Map<string, string> | null;
	tools: Array<Map<string, any>> | null;
	topP: number | null;
	user: string | null;

	/**
	 * Initialise Settings object.
	 *
	 * reChatGPT Settings
	 * @param {string} apiKey
	 * @param {string} theme
	 * @param {string} systemMessage
	 *
	 * OpenAI Chat API Settings
	 * @param {float} frequencyPenalty
	 * @param {object} logitBias
	 * @param {integer} maxTokens
	 * @param {string} model
	 * @param {integer} n
	 * @param {float} presencePenalty
	 * @param {object} responseFormat
	 * @param {integer} seed
	 * @param {string | array} stop
	 * @param {string} stream
	 * @param {float} temperature
	 * @param {string | object} toolChoice
	 * @param {array} tools
	 * @param {float} topP
	 * @param {string} user
	 */
	constructor(
		apiKey = null,
		theme = "system",
		systemMessage = null,
		frequencyPenalty = null,
		logitBias = null,
		maxTokens = null,
		model = "gpt-3.5-turbo",
		n = null,
		presencePenalty = null,
		responseFormat = null,
		seed = null,
		stop = null,
		stream = "true",
		temperature = null,
		toolChoice = null,
		tools = null,
		topP = null,
		user = null
	) {
		this.apiKey = apiKey;
		this.theme = theme;
		this.systemMessage = systemMessage;
		this.frequencyPenalty = frequencyPenalty;
		this.logitBias = logitBias;
		this.maxTokens = maxTokens;
		this.model = model;
		this.n = n;
		this.presencePenalty = presencePenalty;
		this.responseFormat = responseFormat;
		this.seed = seed;
		this.stop = stop;
		this.stream = stream;
		this.temperature = temperature;
		this.toolChoice = toolChoice;
		this.tools = tools;
		this.topP = topP;
		this.user = user;
	}

	/**
	 * Convert the Settings object to JSON.
	 * @returns {object} JSON settings object.
	 */
	toJSON(): object {
		return {
			apiKey: this.apiKey,
			theme: this.theme,
			systemMessage: this.systemMessage,
			frequencyPenalty: this.frequencyPenalty,
			logitBias: this.logitBias,
			maxTokens: this.maxTokens,
			model: this.model,
			n: this.n,
			presencePenalty: this.presencePenalty,
			responseFormat: this.responseFormat,
			seed: this.seed,
			stop: this.stop,
			stream: this.stream,
			temperature: this.temperature,
			toolChoice: this.toolChoice,
			tools: this.tools,
			topP: this.topP,
			user: this.user,
		};
	}

	/**
	 * Create settings object from JSON.
	 * @param {any} json JSON settings object.
	 * @returns {Settings} Settings object.
	 */
	static fromJSON(json: any): Settings {
		const {
			apiKey,
			theme,
			systemMessage,
			frequencyPenalty,
			logitBias,
			maxTokens,
			model,
			n,
			presencePenalty,
			responseFormat,
			seed,
			stop,
			stream,
			temperature,
			toolChoice,
			tools,
			topP,
			user,
		} = json;
		return new Settings(
			apiKey,
			theme,
			systemMessage,
			frequencyPenalty,
			logitBias,
			maxTokens,
			model,
			n,
			presencePenalty,
			responseFormat,
			seed,
			stop,
			stream,
			temperature,
			toolChoice,
			tools,
			topP,
			user
		);
	}

	/**
	 * Save the Settings object to local storage.
	 */
	saveToLocalStorage() {
		const settingsJSON = JSON.stringify(this.toJSON());
		localStorage.setItem("settings", settingsJSON);
	}

	/**
	 * Load the Settings object from local storage.
	 * @returns {Settings} Settings object.
	 */
	static loadFromLocalStorage(): Settings {
		const settingsJSON = localStorage.getItem("settings");
		if (settingsJSON) {
			const settingsData = JSON.parse(settingsJSON);
			return new Settings(
				settingsData.apiKey,
				settingsData.theme,
				settingsData.systemMessage,
				settingsData.frequencyPenalty,
				settingsData.logitBias,
				settingsData.maxTokens,
				settingsData.model,
				settingsData.n,
				settingsData.presencePenalty,
				settingsData.responseFormat,
				settingsData.seed,
				settingsData.stop,
				settingsData.stream,
				settingsData.temperature,
				settingsData.toolChoice,
				settingsData.tools,
				settingsData.topP,
				settingsData.user
			);
		} else {
			return new Settings();
		}
	}

	/**
	 * Clear the Settings object from local storage.
	 */
	static clearLocalStorage() {
		localStorage.removeItem("settings");
	}
}
