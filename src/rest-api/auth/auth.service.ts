import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as USERS from '../users.json';
import { User } from './users.model';

import { generateKeyPair } from 'crypto';
import { Keys } from './keys.model';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  findUser(userEmail: string): User | null {
    const result = Object.values(USERS).filter(
      ({ email }) => email === userEmail,
    );
    return result ? result[0] : null;
  }

  async getKeyPair(): Promise<Keys> {
    return new Promise((resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        },
        (err, pubKey, privKey) => {
          if (err) return reject(new UnauthorizedException());
          resolve({ pubKey, privKey });
        },
      );
    });
  }

  saveKeyPairToUser(key: Keys, email: string) {
    const user: User = this.findUser(email);

    user['keys'] = key;
    this.updateUser(user);
  }

  updateUser(user: User) {
    const jsonPath = path.join(__dirname, '../users.json');

    USERS[user.id] = user;

    const data = JSON.stringify(USERS, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(jsonPath, data, (err) => {
        if (err) throw reject(err);

        resolve(true);
      });
    });
  }
}
