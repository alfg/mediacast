module.exports = {
  pages: {
    index: {
        entry: 'src/main.js',
        template: 'public/index.html'
    },
    receiver: {
        entry: 'src/receiver.js',
        template: 'public/receiver.html'
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/mediacast/'
    : '/'
}