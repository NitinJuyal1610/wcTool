#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program
  .version('1.0.0')
  .description('wc tool')
  .argument('[filePath]', 'File path')
  .option('-l, --lines', 'Count the number of lines in a file')
  .option('-m, --chars', 'Count the number of characters in a file')
  .option('-w, --words', 'Count the number of words in a file')
  .option('-c, --bytes', 'Count the number of bytes in a file')
  .parse(process.argv);

const options = program.opts();

if (!program.args.length) {
  program.outputHelp();
}
