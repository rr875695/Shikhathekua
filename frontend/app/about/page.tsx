import Image from 'next/image'

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About Thekua - Bihar's Traditional Sweet</h1>
        
        <div className="about-content">
          <div className="about-section">
            <h2>History of Thekua</h2>
            <p>
              Thekua is a traditional sweet from Bihar, deeply rooted in the cultural heritage of the region. 
              This delicious treat has been an integral part of Bihar's culinary tradition for centuries, 
              especially during festivals and religious ceremonies.
            </p>
            <p>
              The name "Thekua" comes from the process of making it - "thek" means to press or shape, 
              which refers to the traditional method of shaping the dough into beautiful patterns using 
              wooden molds or by hand.
            </p>
          </div>

          <div className="about-section">
            <h2>Significance in Chhath Puja</h2>
            <p>
              Thekua holds immense religious significance during Chhath Puja, one of the most important 
              festivals in Bihar. It is considered a sacred offering to the Sun God and is prepared with 
              great devotion and purity. The preparation of Thekua during Chhath Puja follows strict 
              traditional methods and is often done by the women of the household as a form of prayer.
            </p>
            <p>
              During the four-day festival, Thekua is offered to the setting and rising sun, symbolizing 
              gratitude and seeking blessings for the family's well-being and prosperity.
            </p>
          </div>

          <div className="about-section">
            <h2>Importance in Ganesh Chaturthi</h2>
            <p>
              Thekua also plays a significant role in Ganesh Chaturthi celebrations in Bihar. It is offered 
              to Lord Ganesha as a prasad (sacred offering) and is believed to bring good luck and prosperity. 
              The sweet taste of Thekua is said to please the deity and bring happiness to the household.
            </p>
            <p>
              The preparation of Thekua during Ganesh Chaturthi is often a community activity, bringing 
              families and neighbors together to celebrate the festival with traditional sweets.
            </p>
          </div>

          <div className="about-section">
            <h2>Cultural Importance in Bihar</h2>
            <p>
              Thekua is more than just a sweet in Bihar - it's a symbol of tradition, culture, and 
              togetherness. It represents the rich culinary heritage of Bihar and is often associated 
              with memories of home, family gatherings, and festive celebrations.
            </p>
            <p>
              The traditional method of making Thekua involves using pure ingredients like wheat flour, 
              jaggery or sugar, and ghee, making it not just delicious but also nutritious. The art of 
              making Thekua is often passed down from generation to generation, preserving the cultural 
              legacy of Bihar.
            </p>
          </div>

          <div className="about-section">
            <h2>Traditional Preparation</h2>
            <p>
              The traditional preparation of Thekua involves kneading wheat flour with jaggery or sugar 
              and ghee to form a smooth dough. The dough is then shaped into various forms - sometimes 
              using wooden molds with intricate designs, and sometimes shaped by hand into simple forms. 
              These are then deep-fried in ghee until golden brown and crispy.
            </p>
            <p>
              The process is often accompanied by prayers and traditional songs, making it a spiritual 
              and cultural experience that goes beyond just cooking.
            </p>
          </div>
        </div>

        <div className="thekua-gallery">
          <h2>Traditional Thekua Images</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="image-placeholder">
                <div className="thekua-icon">🍪</div>
                <p>Traditional Sugar Thekua</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="image-placeholder">
                <div className="thekua-icon">🍪</div>
                <p>Festival Thekua</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="image-placeholder">
                <div className="thekua-icon">🍪</div>
                <p>Chhath Puja Thekua</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
