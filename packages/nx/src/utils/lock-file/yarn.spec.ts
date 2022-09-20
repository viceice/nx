import { parseYarnLockFile, stringifyYarnLockFile } from './yarn';
import { lockFile, berryLockFile } from './__fixtures__/yarn.lock';

describe('yarn LockFile utility', () => {
  describe('classic', () => {
    const parsedLockFile = parseYarnLockFile(lockFile);

    it('should parse lockfile correctly', () => {
      expect(parsedLockFile.lockFileMetadata).toBeUndefined();
      expect(Object.keys(parsedLockFile.dependencies).length).toEqual(324);
      expect(
        parsedLockFile.dependencies['@ampproject/remapping']
      ).toMatchSnapshot();
      expect(parsedLockFile.dependencies['typescript']).toMatchSnapshot();
    });

    it('should map various versions of packages', () => {
      expect(
        Object.keys(parsedLockFile.dependencies['@jridgewell/gen-mapping'])
          .length
      ).toEqual(2);
      expect(
        parsedLockFile.dependencies['@jridgewell/gen-mapping'][
          '@jridgewell/gen-mapping@0.1.1'
        ]
      ).toBeDefined();
      expect(
        parsedLockFile.dependencies['@jridgewell/gen-mapping'][
          '@jridgewell/gen-mapping@0.3.2'
        ]
      ).toBeDefined();
    });

    it('should map various instances of the same version', () => {
      const babelCoreDependency =
        parsedLockFile.dependencies['@babel/core']['@babel/core@7.19.1'];
      expect(babelCoreDependency.packageMeta.length).toEqual(2);
      expect(babelCoreDependency.packageMeta).toEqual([
        '@babel/core@^7.11.6',
        '@babel/core@^7.12.3',
      ]);
    });

    it('should match the original file on stringification', () => {
      expect(stringifyYarnLockFile(parsedLockFile)).toEqual(lockFile);
    });
  });

  describe('berry', () => {
    const parsedLockFile = parseYarnLockFile(berryLockFile);

    it('should parse lockfile correctly', () => {
      expect(parsedLockFile.lockFileMetadata).toEqual({
        __metadata: { cacheKey: '8', version: '6' },
      });
      expect(Object.keys(parsedLockFile.dependencies).length).toEqual(387);
      expect(
        parsedLockFile.dependencies['@ampproject/remapping']
      ).toMatchSnapshot();
      expect(parsedLockFile.dependencies['typescript']).toMatchSnapshot();
    });

    it('should map various versions of packages', () => {
      expect(
        Object.keys(parsedLockFile.dependencies['@jridgewell/gen-mapping'])
          .length
      ).toEqual(2);
      expect(
        parsedLockFile.dependencies['@jridgewell/gen-mapping'][
          '@jridgewell/gen-mapping@0.1.1'
        ]
      ).toBeDefined();
      expect(
        parsedLockFile.dependencies['@jridgewell/gen-mapping'][
          '@jridgewell/gen-mapping@0.3.2'
        ]
      ).toBeDefined();
    });

    it('should map various instances of the same version', () => {
      const babelCoreDependency =
        parsedLockFile.dependencies['@babel/core']['@babel/core@7.19.1'];
      expect(babelCoreDependency.packageMeta.length).toEqual(2);
      expect(babelCoreDependency.packageMeta).toEqual([
        '@babel/core@npm:^7.11.6',
        '@babel/core@npm:^7.12.3',
      ]);
    });

    it('should match the original file on stringification', () => {
      const result = stringifyYarnLockFile(parsedLockFile);
      expect(result).toMatch(
        /This file was generated by Nx. Do not edit this file directly/
      );

      // we don't care about comment message
      const removeComment = (value) => value.split(/\n/).slice(2).join('\n');

      expect(removeComment(result)).toEqual(removeComment(berryLockFile));
    });
  });
});
