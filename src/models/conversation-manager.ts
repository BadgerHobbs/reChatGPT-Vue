import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type Settings from "./settings";

/**
 * Return uuid string.
 */
function uuid(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Message object
 */
export class Message {
	id: string;
	role: string;
	content: string;
	date: Date;

	/**
	 * Initialise Message object.
	 * @param {string | null} id Message id.
	 * @param {string | null} role Message role.
	 * @param {string | null} content Message content.
	 * @param {Date | null} date Message date.
	 */
	constructor(
		id: string | null = null,
		role: string | null = null,
		content: string | null = null,
		date: Date | null = null
	) {
		this.id = id ?? uuid();
		this.role = role ?? "user";
		this.content = content ?? "";
		this.date = date ?? new Date();
	}

	/**
	 * Convert message object to JSON.
	 * @returns {object} JSON message object.
	 */
	toJSON(): object {
		return {
			id: this.id,
			role: this.role,
			content: this.content,
			date: this.date,
		};
	}

	/**
	 * Create message object from JSON.
	 * @param {any} json JSON message object.
	 * @returns {Message} Message object.
	 */
	static fromJSON(json: any): Message {
		const { id, role, content, date } = json;
		return new Message(id, role, content, new Date(date));
	}
}

/**
 * Conversation object.
 */
export class Conversation {
	id: string;
	name: string;
	messages: Array<Message>;

	/**
	 * Initialise Conversation object.
	 * @param {string | null} id Conversation id.
	 * @param {string | null} name Conversation name.
	 * @param {Array<Message> | null} messages Conversation messages.
	 */
	constructor(
		id: string | null = null,
		name: string | null = null,
		messages: Array<Message> | null = null
	) {
		this.id = id ?? uuid();
		this.name = name ?? "";
		this.messages = messages ?? [];
	}

	/**
	 * Convert conversation object to JSON.
	 * @returns {object} JSON conversation object.
	 */
	toJSON(): object {
		const messagesJSON = this.messages.map((message) => message.toJSON());

		return {
			id: this.id,
			name: this.name,
			messages: messagesJSON,
		};
	}

	/**
	 * Create conversation object from JSON.
	 * @param {any} json JSON conversation object.
	 * @returns {Conversation} Conversation object.
	 */
	static fromJSON(json: any): Conversation {
		const { id, name, messages } = json;
		const conversation = new Conversation(id, name);

		conversation.messages = [];
		messages.forEach((messageJSON: any) => {
			const message = Message.fromJSON(messageJSON);
			conversation.messages.push(message);
		});

		return conversation;
	}

	/**
	 * Send this conversation to OpenAI API and update with response message.
	 * @param {OpenAI} openai OpenAI connection object.
	 * @param {Settings} settings Settings object.
	 */
	async send(openai: OpenAI, settings: Settings) {
		const messages = this.messages.map((message) => ({
			role: message.role,
			content: message.content,
		})) as ChatCompletionMessageParam[];

		// Update conversation name if none set
		if (!this.name) {
			this.name = this.messages[this.messages.length - 1].content
				.substring(0, 30)
				.trim()
				.replace(/[\n\t]/g, "");
		}

		// Create new message.
		const responseMessage = new Message(null, "loading", null, null);
		this.messages.push(responseMessage);

		if (settings.stream?.toLowerCase() !== "false") {
			const response = await openai.chat.completions.create({
				messages: messages,
				model: settings.model!,
				stream: true,
			});

			let chunks = [];

			for await (const chunk of response) {
				chunks.push(chunk.choices[0].delta.content);

				// Trigger Vue3 reactivity
				this.messages[this.messages.length - 1] = new Message(
					responseMessage.id,
					"assistant",
					chunks.join(""),
					responseMessage.date
				);
			}
		} else {
			const response = await openai.chat.completions.create({
				messages: messages,
				model: settings.model!,
			});

			// Trigger Vue3 reactivity
			this.messages[this.messages.length - 1] = new Message(
				responseMessage.id,
				"assistant",
				response.choices[0].message.content!,
				responseMessage.date
			);
		}
	}

	/**
	 * Revert back to a conversation message, returning message content.
	 * @param messageId ID of message to revert to.
	 * @returns {string} Content of reverted message.
	 */
	revertToMessage(messageId: string): string {
		let content = null;

		for (let i = this.messages.length - 1; i >= 0; i--) {
			const message = this.messages[i];
			this.messages.splice(i, 1);

			if (message.id === messageId) {
				content = message.content;
				break;
			}
		}

		return content ?? "";
	}
}

/**
 * Conversations object.
 */
export class Conversations {
	conversations: Array<Conversation>;

	/**
	 * Initialise conversations object.
	 * @param {Array<Conversation> | null} conversations List of conversations.
	 */
	constructor(conversations: Array<Conversation> | null = null) {
		this.conversations = conversations ?? [];
	}

	/**
	 * Load conversation by ID.
	 * @param {string | null} conversationId ID of conversation to load.
	 */
	loadConversation(conversationId: string | null): Conversation | null {
		return this.conversations.find(
			(conv) => conv.id === conversationId
		) as Conversation | null;
	}

	/**
	 * Create new conversation.
	 * @returns {Conversation} New conversation object.
	 */
	createConversation(): Conversation {
		return new Conversation();
	}

	/**
	 * Delete conversation by ID.
	 * @param conversationId ID of conversation to delete.
	 */
	deleteConversation(conversationId: string) {
		const conversationIndex = this.conversations.findIndex(
			(conv) => conv.id === conversationId
		);

		if (conversationIndex > -1) {
			this.conversations.splice(conversationIndex, 1);
		}
	}

	/**
	 * Convert conversations object to JSON.
	 * @returns {object} JSON conversations object.
	 */
	toJSON(): object {
		const conversationsJSON = this.conversations.map((conversation) =>
			conversation.toJSON()
		);

		return {
			conversations: conversationsJSON,
		};
	}

	/**
	 * Create conversations object from JSON.
	 * @param {any} json JSON conversations object.
	 * @returns {Conversations} Conversations object.
	 */
	static fromJSON(json: any): Conversations {
		const { conversations } = json;
		const conversationsObject = new Conversations();

		conversations.forEach((conversationJSON: any) => {
			const conversation = Conversation.fromJSON(conversationJSON);
			conversationsObject.conversations.push(conversation);
		});

		return conversationsObject;
	}

	/**
	 * Save the Conversations object to local storage.
	 */
	saveToLocalStorage() {
		const conversationsJSON = JSON.stringify(this.toJSON());
		localStorage.setItem("conversations", conversationsJSON);
	}

	/**
	 * Load the Conversations object from local storage.
	 * @returns {Conversations} Conversations object.
	 */
	static loadFromLocalStorage(): Conversations {
		const conversationsJSON = localStorage.getItem("conversations");
		if (conversationsJSON) {
			const conversationsData = JSON.parse(conversationsJSON);
			return Conversations.fromJSON(conversationsData);
		} else {
			return new Conversations();
		}
	}

	/**
	 * Clear the Conversations object from local storage.
	 */
	static clearLocalStorage() {
		localStorage.removeItem("conversations");
	}
}
