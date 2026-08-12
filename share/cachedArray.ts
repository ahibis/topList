
class cachedArray {
  cache: string = "";
  bitsOnNumber: number = 4;
  numsOnSlice: number = 0;
  count = 0;
  cacheNumber64 = 0;
  number64ToBase64(num: number) {
    const mask = (1 << 8) - 1;
    const c = num & mask;
    const b = (num >> 8) & mask;
    const a = num >> 16;
    // Создаём строку из 3 символов (байт)
    const str = String.fromCharCode(a, b, c);
    return btoa(str);  // Вернёт 4 символа Base64
  }

  base64ToNumber64(base64: string) {
    const str = atob(base64);
    const arr = [str.charCodeAt(0), str.charCodeAt(1), str.charCodeAt(2)];
    return (arr[0] << 16) | (arr[1] << 8) | arr[0];

  }
  number64ToArray(val: number) {
    const { bitsOnNumber } = this;
    const mask = (1 << this.bitsOnNumber) - 1;
    const res = [];
    while (val > 0) {
      res.push(val & mask);
      val >> bitsOnNumber;
    }
    return res.reverse();
  }

  setBitsOnNumber(bitsOnNumber: number) {
    const thresholds = [4, 6, 8, 12, 24];
    const bits = thresholds.find(t => bitsOnNumber <= t) ?? 24;

    this.bitsOnNumber = bits;
    this.numsOnSlice = 24 / bits;
  }
  constructor(bitsOnNumber: number) {
    this.setBitsOnNumber(bitsOnNumber)
  }
}

