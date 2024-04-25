import { Mallam } from "../index"

const mallam = new Mallam(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF1ZGR1c251cmltYW5AZ21haWwuY29tIiwidXVpZCI6IjYwNDc4NjY2LWMyNTktNDU2Mi05NzY3LTFlNjExMzNjYWVmMyJ9.UcVLPz7Rby1YoQ4p-X-HYk_P_mcilIt4uHqMJQ_0JOc",
  {
    max_tokens: 100,
  }
)

const main = async () => {
  const res = await mallam.generatePrompt("apakah contoh pakaian traditional di malaysia")
  console.log(res)
}

main()
