import { expect, test, describe, beforeEach, afterEach } from '@jest/globals';
import {
	_convertFileToVarname,
	generateHeaderFileStream,
	generateHeaderFile,
	NamedStream,
} from '../../lib/';
import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';

test('stream is converted to progmem c code', async () => {
	const finished = util.promisify(stream.finished);

	const mockedInputStream = new stream.PassThrough();

	const namedStream: NamedStream = {
		stream: mockedInputStream,
		filename: 'test.js',
	};

	mockedInputStream.write("console.log('hello world');\n");
	mockedInputStream.end();

	const mockedOutputStream = new stream.PassThrough();
	await generateHeaderFileStream([namedStream], mockedOutputStream);
	mockedOutputStream.end();

	let streamData = '';

	for await (const chunk of mockedOutputStream as unknown as AsyncIterable<Buffer>) {
		streamData += chunk;
	}

	await finished(mockedOutputStream);
	expect(streamData).toContain(
		'const char FILE_TEST_JS[] PROGMEM = R"=====(console.log(\'hello world\');\n)=====";\n'
	);
});

test('Filenames are converted to proper varnames', () => {
	expect(_convertFileToVarname('test.ts')).toBe('TEST_TS');
	expect(_convertFileToVarname('te/söt.ts')).toBe('TE_S_T_TS');
	expect(_convertFileToVarname(' .ts')).toBe('__TS');
});

describe('With a fs', () => {
	test('Html files are converted to header files', () => {
        fs.unlinkSync('test.h');
		return generateHeaderFile(['test.html'], 'test.h').then(
			() => {
				const contens = fs.readFileSync('test.h', {
					encoding: 'utf8',
					flag: 'r',
				});
				expect(contens).toBe(
					'#pragma once\n\nconst char FILE_TEST_HTML[] PROGMEM = R"=====(<p>test</p>)=====";\n'
				);
			}
		);
	});
});
