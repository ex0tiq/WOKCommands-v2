import {AutocompleteInteraction, Client} from "discord.js";

import WOK, { AutocompleteChoice } from "../../../../../typings.js";

export default async (interaction: AutocompleteInteraction, client: Client, instance: WOK) => {
  const { commandHandler } = instance;
  if (!commandHandler) {
    return;
  }

  const { commands } = commandHandler;
  const command = commands.get(interaction.commandName);
  if (!command) {
    return;
  }

  const { autocomplete } = command.commandObject;
  if (!autocomplete) {
    return;
  }

  const focusedOption = interaction.options.getFocused(true);
  const choices = await autocomplete(command, focusedOption.name, interaction, client, instance);

  const filtered = choices
    .filter((choice: AutocompleteChoice) => {
      const choiceName = choice.name || (choice as string);
      return choiceName.toLowerCase().includes(focusedOption.value.toLowerCase())
    })
    .slice(0, 25);

  await interaction.respond(
    filtered.map((choice: AutocompleteChoice) => ({
      name: choice.name || choice,
      value: choice.value || choice,
    }))
  );
};
