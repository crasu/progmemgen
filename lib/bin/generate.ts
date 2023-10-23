#!/usr/bin/env node
import process from 'node:process'
import { generateHeaderFile } from '../index.js'

if (process.argv.length >= 4) {
	const outputfile = process.argv.pop()
	const inputfiles = process.argv
	generateHeaderFile(inputfiles, outputfile)
	console.log(`Inputfiles written to ${outputfile}`)
} else {
	console.log(
		'USAGE: npx progmemgen [inputfile1.js inputfile.html 2 ...] outputfile.h'
	);
}
