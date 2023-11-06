const availableTests = {
  atrium: 'atrium',
};

export interface TestSuite {
  test: keyof typeof availableTests;
}
