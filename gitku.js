#!/usr/bin/env node

import OpenAI from "openai";
import { spawnSync } from "child_process";
import { program } from "commander";
import { env } from "process";

// Replace with your OpenAI API key
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

async function generateHaiku(newCommitMessage) {
  const prompt = `Change this commit message to be much more poetic:\n\n${newCommitMessage}`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 40,
    temperature: 0.1,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  const haiku = response.choices[0].text.trim().replace(/\n/g, " ");
  return haiku;
}

async function gitHaikuCommit(message) {
  const haiku = await generateHaiku(message);
  const gitCommand = `git commit -m "${haiku}"`;

  try {
    const result = spawnSync(gitCommand, { shell: true });
    if (result.error) {
      console.error(`Error: ${result.error.message}`);
    } else {
      console.log("Commit successful with the following message:");
      console.log(haiku);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

program.option("-m, --message <message>");

program.parse(process.argv);

const options = program.opts();

if (options.message) {
  await gitHaikuCommit(options.message);
} else {
  console.log("Please provide a commit message using the --message option.");
}
