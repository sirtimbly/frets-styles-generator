export declare interface Baretest {
  (t: string, f: () => void): void
  run(): () => Promise<boolean>
  skip(): (f: () => void) => void
  before(): (f: () => void) => void
  after(): (f: () => void) => void
  only(): (name: string, f: () => void) => void
}
