import { open } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { Option, OptionValues } from 'commander';

export const calculateStats = async (
  filePath: string,
  options: OptionValues,
) => {
  if (!existsSync(filePath)) {
    throw new Error('File does not exist');
  }
  const fileName = path.basename(filePath);

  // file exists
  const fileReadHandle = await open(filePath, 'r');
  const readableStream = fileReadHandle.createReadStream();

  let byteCount = 0;
  let linesCount = 0;
  let wordCount = 0;
  let charCount = 0;

  let lastByte = ' ';

  readableStream.on('data', (chunk) => {
    //bytes count
    byteCount += chunk.length;

    //lines count
    linesCount += chunk.toString('utf-8').split('\n').length - 1;

    //word count
    const sentence = chunk.toString('utf-8').replace(/[\r\n\t]/g, ' ');
    if (lastByte !== ' ' && sentence[0] != ' ') wordCount--;

    wordCount += sentence.split(' ').filter(function (n) {
      return n != '';
    }).length;

    lastByte = sentence.slice(-1);

    //char count
  });

  readableStream.on('end', () => {
    let result = '';

    if (options.lines) result += `lines ${linesCount} `;
    if (options.words) result += `words ${wordCount} `;
    if (options.bytes) result += `bytes ${byteCount} `;

    result += `- ${fileName}`;
    console.log(result);
  });
};
