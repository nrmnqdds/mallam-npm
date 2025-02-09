import { Mallam } from "../lib/mallam";
import { ChatCompletionResponse } from "../types";
import { expect } from "chai";
import sinon from "sinon";

describe("Completion", () => {
	let mallam: Mallam;
	let fetchStub: sinon.SinonStub;

	beforeEach(() => {
		mallam = new Mallam(process.env.MALLAM_API_KEY as string);
		// Reset stubs between tests
		if (fetchStub) fetchStub.restore();
	});

	afterEach(() => {
		sinon.restore();
	});

	it("should return type-safe response", async () => {
		const mockResponse: ChatCompletionResponse = {
			id: "test-id",
			message: "Abuja is the capital of Nigeria",
			usage: {
				completion_tokens: 10,
				prompt_tokens: 20,
				total_tokens: 30,
			},
		};

		fetchStub = sinon.stub(global, "fetch").resolves({
			ok: true,
			json: async () => mockResponse,
		} as Response);

		const response = await mallam.chatCompletion("What is the capital of Nig");

		expect(response).to.exist;
		expect(response).to.have.property("id");
		expect(response).to.have.property("message").that.is.a("string");
		expect(response).to.have.property("usage").that.deep.includes({
			prompt_tokens: 10,
			completion_tokens: 10,
			total_tokens: 30,
		});
	});

	it("should handle API errors", async () => {
		fetchStub = sinon.stub(global, "fetch").resolves({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
		} as Response);

		try {
			await mallam.chatCompletion("test prompt");
			expect.fail("Should have thrown an error");
		} catch (error) {
			expect(error).to.exist;
		}
	});
});
