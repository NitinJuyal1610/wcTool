import { calculateStats } from './logic/fileStream.js';
import { stdin } from 'process';
import { Command } from 'commander';
const program = new Command();
program
  .version('1.0.0')
  .description('wc tool')
  .usage('[options] <filePath> ')
  .option('-l, --lines', 'Count the number of lines in a file')
  .option('-m, --chars', 'Count the number of characters in a file')
  .option('-w, --words', 'Count the number of words in a file')
  .option('-c, --bytes', 'Count the number of bytes in a file')
  .parse(process.argv);

const options = program.opts();

const files = [...program.args];

const handleFile = async (file: string) => {
  await calculateStats(file, options);
};

const handleStdin = async () => {
  await calculateStats('', options);
};

if (files.length > 0) {
  files.forEach(handleFile);
} else if (!stdin.isTTY) {
  handleStdin();
} else {
  program.help();
}
