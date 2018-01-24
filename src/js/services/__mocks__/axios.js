const data = {
  data: {
    items: [
      {
        id: '1',
        comment: 'foo',
      },
      {
        id: '2',
        comment: 'bar',
      },
    ],
  },
};

export default {
  get: jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(data), 0))),
};
