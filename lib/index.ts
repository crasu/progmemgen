import * as fs from 'fs';
import path from 'path';
import * as util from 'util';
import * as stream from 'stream';

export interface NamedStream {
	stream: stream.Readable;
	filename: string;
}

export async function generateHeaderFileStream(
	inputStreams: NamedStream[],
	outputStream: stream.Writable
) {
	for (const inputStream of inputStreams) {
		const varname = _convertFileToVarname(inputStream.filename);
		await convertStream(inputStream.stream, varname, outputStream);
	}
}

export function _convertFileToVarname(filename: string) {
	return filename.replaceAll(/\W/g, '_').toUpperCase();
}

async function convertStream(
	inputStream: stream.Readable,
	filename: string,
	outputStream: stream.Writable
) {
	const C_HEADER = `#pragma once\n\n`;
	const FILE_PREFIX = `const char FILE_${filename}[] PROGMEM = R"=====(`;
	const FILE_POSTFIX = `)=====";\n`;

	outputStream.write(C_HEADER);

	outputStream.write(FILE_PREFIX);

	for await (const chunk of inputStream as unknown as AsyncIterable<Buffer>) {
		outputStream.write(chunk);
	}

	outputStream.write(FILE_POSTFIX);
}

export async function generateHeaderFile(
	jsFiles: string[],
	headerFilename?: string
) {
	if (headerFilename.length == 0) {
		headerFilename = 'index.h';
	}

	const outputStream = fs.createWriteStream(headerFilename);

	const namedStreams: NamedStream[] = jsFiles.map((filename) => {
		return {
			stream: fs.createReadStream(filename),
			filename: path.basename(filename),
		};
	});

	const finished = util.promisify(stream.finished);

	await generateHeaderFileStream(namedStreams, outputStream);

	outputStream.end();
	await finished(outputStream);
}
