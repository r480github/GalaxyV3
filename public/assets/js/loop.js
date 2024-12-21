import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

gsap.defaults({
  duration: 1,
})
const tl = gsap.timeline({
  paused: true,
})
const lines = gsap.utils.toArray('ul li')
gsap.set('ul li', { yPercent: 300 })
const paddedLines = [...lines, ...lines, ...lines]
paddedLines.forEach((line, index) => {
  const lineTl = gsap.timeline().set(line, { yPercent: 300 }).to(
    line,
    {
      yPercent: '-=600',
      repeatRefresh: true,
      immediateRender: false,
      ease: 'none',
      duration: 6,
    },
    0
  )
  tl.add(lineTl, index)
})

const scrubber = gsap.timeline({ paused: true }).fromTo(
  tl,
  {
    totalTime: lines.length + 1,
  },
  {
    totalTime: lines.length * 2 + 1,
    ease: 'none',
    duration: lines.length,
    repeat: -1,
  }
)
gsap.set(scrubber, { totalTime: lines.length + 2 })

let index = 0
gsap.set('.indicator', {
  '--width': lines[index].getBoundingClientRect().width,
})

const syncIndicator = () => {
  index += 1
  gsap.set('.indicator', {
    '--width': lines[index % lines.length].getBoundingClientRect().width,
    '--h': gsap.utils.random(0, 359)
  })
}

gsap.to(scrubber, {
  delay: 1,
  totalTime: '+=1',
  duration: 1.5,
  repeat: 5,
  repeatDelay: 0.6,
  repeatRefresh: true,
  onStart: syncIndicator,
  onRepeat: syncIndicator,
  ease: 'elastic.out(1, 0.875)',
})

gsap.set('.container', { opacity: 1 })
