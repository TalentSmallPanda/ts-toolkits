export default class RandomUtils {
  private static readonly DEFAULT_CHARACTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private static readonly LOWERCASE_CHARACTERS: string = "abcdefghijklmnopqrstuvwxyz";

  static getInt(min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
    [min, max] = [Math.ceil(min), Math.floor(max)];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getString(length = 10, characters: string = this.DEFAULT_CHARACTERS): string {
    const finalLength = length < 0 ? 10 : length;
    const finalCharacters = characters.length === 0 ? this.DEFAULT_CHARACTERS : characters;
    const charactersLength = finalCharacters.length;
    let result = "";
    for (let i = 0; i < finalLength; i++) {
      result += finalCharacters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static getImage(w = 100, h = 50): string {
    return "https://picsum.photos" + "/" + w + "/" + h + "?random=" + this.getInt();
  }

  static getColor(): string {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  static getBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  static getFloat(min = 0, max = 100, precision = 2): number {
    const factor = Math.pow(10, precision);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
  }

  static getPhone(): string {
    const area = RandomUtils.getInt(100, 999);
    const prefix = RandomUtils.getInt(100, 999);
    const line = RandomUtils.getInt(1000, 9999);
    return `${area}-${prefix}-${line}`;
  }

  static getEmail(domain = "qq.com"): string {
    const username = this.getString(this.getInt(5, 15));
    return `${username}@${domain}`;
  }

  static getDate(start: Date = new Date(2000, 0, 1), end: Date = new Date()): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  static getEnName(): string {
    const str = this.LOWERCASE_CHARACTERS;
    const firstNameLength = this.getInt(3, 7);
    const lastNameLength = this.getInt(4, 10);
    const firstName = this.getString(firstNameLength, str).replace(/^./, (c) => c.toUpperCase());
    const lastName = this.getString(lastNameLength, str).replace(/^./, (c) => c.toUpperCase());
    return `${firstName} ${lastName}`;
  }

  static getEnAddress(): string {
    const str = this.LOWERCASE_CHARACTERS;
    const streetNumber = this.getInt(1, 999);
    const streetNameLength = this.getInt(5, 10);
    const streetName = this.getString(streetNameLength, str).replace(/^./, (c) => c.toUpperCase());
    const cityLength = this.getInt(4, 8);
    const city = this.getString(cityLength, str).replace(/^./, (c) => c.toUpperCase());
    const state = this.getString(2, str).toUpperCase();
    const zipCode = this.getInt(10000, 99999);
    return `${streetNumber} ${streetName} St, ${city}, ${state} ${zipCode}`;
  }

  static getUuid(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    const random = Math.floor(Math.random() * 0x10000000000000000)
      .toString(16)
      .padStart(16, "0");
    return `${random.slice(0, 8)}-${random.slice(8, 12)}-${random.slice(12, 16)}-${random.slice(16, 20)}-${random.slice(
      20
    )}`;
  }
}
