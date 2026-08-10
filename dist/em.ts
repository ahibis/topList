
import { writeFile, readFile } from "fs/promises"

async function main() {
  const data = JSON.parse(await readFile("./porn_raw.json", "utf-8"));

  const list = (data as {
    NAME: string,
    VALUE: string
  }[])
  console.log(list)
  await writeFile("./porn.json", JSON.stringify(list.map(v => ({
    name: v.NAME,
    url: "https://pikuco.ru" + v.VALUE
  }))))
}
main()
