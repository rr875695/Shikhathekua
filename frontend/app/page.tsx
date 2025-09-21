import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-text">
          <h1>Bihar Thekua's</h1>
          <p>Bihar ka asli swaad – ek bite mein pura pyaar</p>
          <div className="explore-section">
            <Link href="/products" className="explore-btn">
              Explore Thekua Varieties
            </Link>
          </div>
        </div>
        <div className="landing-image">
          <Image
            src="/thekua1.jpg"
            alt="Woman holding Thekua plate"
            width={500}
            height={600}
            priority
            className="thekua-image"
          />
        </div>
      </div>
    </div>
  )
}
