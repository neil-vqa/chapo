const form = document.querySelector("form");
const submitButton = document.querySelector('button[type="submit"]');
const resultParagraph = document.getElementById("result");
const textarea = document.getElementById("textarea");
const charCount = document.getElementById("charCount");
const maxChars = 4000;

const updateCharCount = () => {
  const remainingChars = maxChars - textarea.value.length;
  charCount.textContent = remainingChars;
}

textarea.addEventListener("input", updateCharCount);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.innerText = "Processing...";

  const task = document.getElementById("task").value;
  const rawText = document.getElementById("textarea").value;
  const extractEntities = document.getElementById("extract-entities").value;

  const extractThese = `\n\n\nExtract the following info: ${extractEntities}`;
  const prompt = `Do ${task} the given text:\n\n\n${rawText}${task === "Extract information" ? extractThese : ""
    }`;

  const formData = {
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    const chatCompletions = "http://127.0.0.1:8080/v1/chat/completions";
    const response = await fetch(`${chatCompletions}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer no-key",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);
    const modelRes = result.choices[0].message.content;

    resultParagraph.innerText = modelRes;
  } catch (error) {
    console.error("Error:", error);
    resultParagraph.innerText = "Error:" + error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = "Go";
  }
});
