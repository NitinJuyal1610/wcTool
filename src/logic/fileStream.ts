import { open } from 'fs/promises';
import { existsSync, read } from 'fs';
import path from 'path';
import { OptionValues } from 'commander';
import { stdin } from 'process';

export const calculateStats = async (
  filePath: string,
  options: OptionValues,
) => {
  const fileName = path.basename(filePath);

  let readableStream: NodeJS.ReadableStream;

  if (existsSync(fileName)) {
    // file exists
    const fileReadHandle = await open(filePath, 'r');
    readableStream = fileReadHandle.createReadStream();
  } else {
    readableStream = stdin;
  }

  let byteCount = 0;
  let linesCount = 0;
  let wordCount = 0;
  let charCount = 0;

  let lastByte = ' ';

  //reading bytes/string
  readableStream.on('data', (chunk) => {
    const chunkString = chunk.toString('utf-8');
    //bytes count
    byteCount += chunk.length;

    //lines count
    linesCount += chunkString.split('\n').length - 1;

    //word count
    const sentence = chunkString.replace(/[\r\n\t]/g, ' ');
    if (lastByte !== ' ' && sentence[0] != ' ') wordCount--;

    wordCount += sentence.split(' ').filter(function (n: string) {
      return n != '';
    }).length;

    lastByte = sentence.slice(-1);

    //char count
    charCount += sentence.length;
  });

  // reading completed

  readableStream.on('end', () => {
    let result = '';
    let defaultOptions = false;

    if (Object.keys(options).length == 0) defaultOptions = true;

    if (options.lines || defaultOptions) result += `lines ${linesCount} `;
    if (options.words || defaultOptions) result += `words ${wordCount} `;
    if (options.bytes || defaultOptions) result += `bytes ${byteCount} `;
    if (options.chars || defaultOptions) result += `chars ${charCount} `;

    result += ` ${fileName}`;
    console.log(result);
  });
};
