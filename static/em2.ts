import { writeFile, readFile } from "fs/promises"

async function main() {
  const file = "./streamers.json"
  const data = JSON.parse(await readFile(file, "utf-8"));

  const list = (data as string[])
  console.log(list)
  await writeFile(file, JSON.stringify(list.map(v => ({
    name: "",
    url: v
  }))))
}
main()
