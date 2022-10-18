import { Injectable } from '@nestjs/common';
import { pdfUrl } from '../constants';
import * as http from 'http';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

export type keys = {
  publicKey: string;
  privateKey: string;
};

@Injectable()
export class EncryptService {
  async getPdfFile() {
    return new Promise((resolve, reject) => {
      http.get(pdfUrl, (res) => {
        const chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          resolve(Buffer.concat(chunks).toString('base64'));
        });
      });
    });
  }

  encryptPdfFile(base64File, pubKey) {
    console.log({ base64File, pubKey });
    const buffer = Buffer.from(base64File);
    const encrypted = crypto.publicEncrypt(
      pubKey,
      // { key: pubKey, padding: crypto.constants.RSA_NO_PADDING },
      buffer,
    );
    return encrypted.toString('base64');
  }
}
