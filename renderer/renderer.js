const form = document.querySelector("form");
const submitButton = document.querySelector('button[type="submit"]');
const resultParagraph = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.innerText = "Processing...";

  const task = document.getElementById("task").value;
  const rawText = document.getElementById("raw-text").value;
  const extractEntities = document.getElementById("extract-entities").value;

  const extractThese = `\n\n\nExtract the following info: ${extractEntities}`;
  const prompt = `Do ${task} the given text:\n\n\n${rawText}${
    task === "Extract information" ? extractThese : ""
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
    const baseUrl = "http://127.0.0.1:8080";
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
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
