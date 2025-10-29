import CryptoJS from 'crypto-js'

export function encryptText(plainText, secret) {
  return CryptoJS.AES.encrypt(plainText, secret).toString()
}

export function decryptText(cipherText, secret) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generatePassword({ length = 16, upper = true, lower = true, digits = true, symbols = true } = {}) {
  const sets = []
  if (upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  if (lower) sets.push('abcdefghijklmnopqrstuvwxyz')
  if (digits) sets.push('0123456789')
  if (symbols) sets.push('!@#$%^&*()-_=+[]{};:,.<>?')
  const all = sets.join('')
  if (!all) return ''
  let out = ''
  const cryptoObj = window.crypto || window.msCrypto
  const buf = new Uint32Array(length)
  cryptoObj.getRandomValues(buf)
  for (let i = 0; i < length; i++) {
    out += all[buf[i] % all.length]
  }
  return out
}
