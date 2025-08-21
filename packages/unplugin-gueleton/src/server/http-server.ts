import http from 'node:http'
import chalk from 'chalk'
import connect from 'connect'

export class HttpServer {
  private app: connect.Server
  private server: http.Server

  public port: number = 0
  public debug: boolean

  constructor(debug: boolean) {
    this.debug = debug
    this.app = connect()
    this.setupMiddlewares()
    this.server = http.createServer(this.app)
  }

  get listening(): boolean {
    return this.server.listening
  }

  private setupMiddlewares(): void {
    // 日志中间件
    this.app.use(this.loggerMiddleware.bind(this))

    // 错误处理中间件
    this.app.use(this.errorHandlerMiddleware.bind(this))

    // CORS 中间件
    this.app.use(this.corsMiddleware.bind(this))
  }

  // 日志中间件
  private loggerMiddleware(req: http.IncomingMessage, res: http.ServerResponse, next: connect.NextFunction): void {
    if (!this.debug) {
      next()
      return
    }

    const start = Date.now()
    const { url = '/', method = 'GET' } = req

    res.on('finish', () => {
      const duration = Date.now() - start
      const { statusCode = 200 } = res

      const statusColor = statusCode >= 500 ? chalk.red : statusCode >= 400 ? chalk.yellow : chalk.green
      const methodColors: Record<string, any> = { POST: chalk.green, PUT: chalk.yellow, DELETE: chalk.red }
      const methodColor = methodColors[method] || chalk.blue
      const durationColor = duration > 1000 ? chalk.red : duration > 500 ? chalk.yellow : duration > 100 ? chalk.cyan : chalk.gray

      console.warn([
        chalk.gray(`[${new Date().toISOString()}]`),
        methodColor.bold(method),
        chalk.white(url),
        statusColor.bold(statusCode),
        durationColor(`(${duration}ms)`),
      ].join(' '))
    })

    next()
  }

  // 错误处理中间件
  private errorHandlerMiddleware(error: any, req: http.IncomingMessage, res: http.ServerResponse, next: connect.NextFunction): void {
    if (!error)
      return next()

    const { url = '/', method = 'GET' } = req
    const timestamp = new Date().toISOString()

    console.error([
      chalk.gray(`[${timestamp}]`),
      chalk.red.bold('ERROR'),
      chalk.blue(method),
      chalk.white(url),
      chalk.red(error.message || 'Unknown error'),
    ].join(' '))

    if (error.stack) {
      console.error(chalk.red('Stack trace:'), chalk.gray(error.stack))
    }

    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }
  }

  private corsMiddleware(req: http.IncomingMessage, res: http.ServerResponse, next: connect.NextFunction): void {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
    } else {
      next()
    }
  }

  public start(port: number): Promise<void> {
    this.port = port
    return new Promise(resolve => this.server.listen(this.port, () => resolve()))
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => this.server.close(err => err ? reject(err) : resolve()))
  }

  public use(path: string | connect.HandleFunction, fn?: connect.HandleFunction): this {
    if (typeof path === 'string' && fn) {
      this.app.use(path, fn)
    }
    else {
      this.app.use(path as connect.HandleFunction)
    }
    return this
  }

  public getApp(): connect.Server {
    return this.app
  }
}

export default HttpServer
