import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { videoAccounts, videoEvidence } from '@/data/videoAccounts'
import { portfolioProjects } from '@/data/resume'
import './VideoAccountDetail.css'

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children} ↗
  </a>
)

export default function VideoAccountDetail() {
  const [selected, setSelected] = useState('asus')
  const [expanded, setExpanded] = useState(false)
  const [evidence, setEvidence] = useState(videoEvidence[0])
  const dialog = useRef(null)
  const account = videoAccounts.find((item) => item.id === selected)
  const project = portfolioProjects.find((item) => item.id === 'video-account')
  const nextProject =
    portfolioProjects[(portfolioProjects.indexOf(project) + 1) % portfolioProjects.length]
  const showEvidence = (item) => {
    setEvidence(item)
    dialog.current.showModal()
  }

  return (
    <main className="video-case">
      <nav className="video-case__nav">
        <Link to="/">HX.</Link>
        <Link to="/#works">← 返回项目</Link>
      </nav>
      <article>
        <header className="video-case__hero">
          <div>
            <span className="video-case__eyebrow">CONTENT / COMMERCE / TEAM</span>
            <h1>
              视频账号矩阵<span>从0-1搭建，与团队接力。</span>
            </h1>
            <p>
              先后从 0 到 1 搭建三个数码店铺账号与一个个人
              IP账号，贯通选题、脚本、拍摄、剪辑、发布和投流，并完成前期账号与视频团队的交接。
            </p>
            <div className="video-case__tags">
              <span>账号搭建</span>
              <span>全链路制作</span>
              <span>投流执行</span>
              <span>团队管理</span>
            </div>
            <a className="video-case__text-link" href="#account-showcase">
              探索账号与代表作品 ↓
            </a>
          </div>
          <div className="video-case__hero-media">
            <video
              src={project.video}
              width="1440"
              height="1080"
              poster={project.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label="视频账号矩阵演示"
            />
          </div>
          <div className="video-case__overview" aria-label="四个参与搭建的账号">
            {videoAccounts.map((item, index) => (
              <a
                key={item.id}
                href="#account-showcase"
                onClick={() => {
                  setSelected(item.id)
                  setExpanded(false)
                }}
              >
                <span>0{index + 1}</span>
                <strong>{item.name}</strong>
                <small>{item.type}</small>
              </a>
            ))}
          </div>
        </header>

        <section className="video-case__section" aria-labelledby="journey-title">
          <span className="video-case__eyebrow">01 / THE JOURNEY</span>
          <h2 id="journey-title">从独立执行，走向团队协作。</h2>
          <ol className="video-case__timeline">
            {[
              ['HKC 起步', '从零搭建首个数码视频账号，负责全链路制作。'],
              ['飞利浦起号', '继续搭建显示器店铺账号，贯通制作。'],
              ['交接团队', '与团队共同协作。'],
              ['双线推进', '主攻华硕锐达，同时搭建正正装机个人IP账号。'],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="video-case__section"
          id="account-showcase"
          aria-labelledby="accounts-title"
        >
          <span className="video-case__eyebrow">02 / ACCOUNT PORTFOLIO</span>
          <h2 id="accounts-title">四个账号，不同的内容角色。</h2>
          <div className="video-case__switcher" aria-label="选择账号">
            {videoAccounts.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selected === item.id}
                onClick={() => {
                  setSelected(item.id)
                  setExpanded(false)
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="video-case__account" key={account.id}>
            <button
              type="button"
              className="video-case__profile"
              onClick={() =>
                showEvidence({
                  title: account.name,
                  image: account.image,
                  note: '截图时账号规模，非本人任期净增数据；包含团队持续运营成果。',
                })
              }
              aria-label={`放大${account.name}主页截图`}
            >
              <img
                src={account.image}
                alt={`${account.name}抖音主页`}
                width="1206"
                height="2622"
                loading="lazy"
                decoding="async"
              />
            </button>
            <div>
              <span className="video-case__eyebrow">{account.type}</span>
              <h3 className="video-case__account-title">{account.name}</h3>
              <p>{account.description}</p>
              <p className="video-case__scope">我的职责 / {account.scope}</p>
              <dl className="video-case__numbers">
                <div>
                  <dt>截图时粉丝</dt>
                  <dd>{account.followers}</dd>
                </div>
                <div>
                  <dt>截图时获赞</dt>
                  <dd>{account.likes}</dd>
                </div>
              </dl>
              <small className="video-case__note">
                账号累计规模，包含团队持续运营成果，不代表个人任期净增。
              </small>
              <div className="video-case__actions">
                <ExternalLink href={account.url}>访问抖音主页</ExternalLink>
              </div>
              <h4>
                代表作品 /{' '}
                {account.works.length ? String(account.works.length).padStart(2, '0') : '待补充'}
              </h4>
              {account.works.length ? (
                <>
                  <ul className="video-case__works">
                    {(expanded ? account.works : account.works.slice(0, 3)).map((work) => (
                      <li key={work.id}>
                        <ExternalLink href={work.url}>{work.title}</ExternalLink>
                        {work.id === '7569929018187713802' && (
                          <button type="button" onClick={() => showEvidence(videoEvidence[0])}>
                            数据佐证
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {account.works.length > 3 && (
                    <button
                      type="button"
                      className="video-case__more"
                      aria-expanded={expanded}
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? '收起作品 −' : `展开全部 ${account.works.length} 条作品 +`}
                    </button>
                  )}
                  <small className="video-case__note">
                    原视频在抖音打开，可能需要登录或跳转 App。
                  </small>
                </>
              ) : (
                <p>先展示账号搭建经历，代表作品后续补充。可通过主页继续浏览。</p>
              )}
            </div>
          </div>
        </section>

        <section
          className="video-case__section video-case__featured"
          aria-labelledby="featured-title"
        >
          <div>
            <span className="video-case__eyebrow">03 / FEATURED CONTENT</span>
            <h2 id="featured-title">把硬件知识，变成可理解的内容。</h2>
            <p>华硕锐达 · EXPO 开启教程</p>
            <p>负责选题、脚本、拍摄、剪辑、发布与投流。</p>
            <div className="video-case__actions">
              <ExternalLink href={videoAccounts[0].works[0].url}>观看原视频</ExternalLink>
              <button type="button" onClick={() => showEvidence(videoEvidence[0])}>
                查看完整数据
              </button>
            </div>
          </div>
          <div>
            <dl className="video-case__numbers video-case__numbers--featured">
              {[
                ['播放量', '115.06 万'],
                ['点赞量', '2.58 万'],
                ['收藏量', '1.25 万'],
                ['分享量', '2,750'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <small className="video-case__note"></small>
            <button
              type="button"
              className="video-case__more"
              onClick={() => showEvidence(videoEvidence[1])}
            >
              查看作品管理截图 ↗
            </button>
          </div>
        </section>

        <section className="video-case__section" aria-labelledby="commerce-title">
          <span className="video-case__eyebrow">04 / COMMERCE CONTEXT</span>
          <h2 id="commerce-title">华硕锐达 · 618 阶段复盘</h2>
          <p>主导账号内容制作与投流执行。以下展示店铺后台的不同统计口径。</p>
          <div className="video-case__evidence-grid">
            {videoEvidence.slice(2).map((item) => (
              <section key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                <button
                  type="button"
                  className="video-case__evidence-image"
                  onClick={() => showEvidence(item)}
                  aria-label={`放大${item.title}截图`}
                >
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                </button>
                {item.id === 'commerce' && <p className="video-case__note"></p>}
                <button
                  type="button"
                  className="video-case__more"
                  onClick={() => showEvidence(item)}
                >
                  查看原始数据截图 ↗
                </button>
              </section>
            ))}
          </div>
        </section>

        <section className="video-case__section video-case__handoff">
          <span className="video-case__eyebrow">05 / TEAM HANDOFF</span>
          <h2>从自己完成，到让团队持续完成。</h2>
          <p>参与范围覆盖内容全链路，包含账号与团队管理。</p>
          <div className="video-case__chain">选题 → 脚本 → 拍摄 → 剪辑 → 发布 → 投流</div>
        </section>
      </article>
      <footer className="video-case__nav">
        <Link to="/#works">← 返回全部项目</Link>
        <Link to={`/projects/${nextProject.id}`}>下一个项目 · {nextProject.title} ↗</Link>
      </footer>
      <dialog
        ref={dialog}
        className="video-case__dialog"
        aria-labelledby="evidence-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close()
        }}
      >
        <div>
          <h2 id="evidence-title">{evidence.title}</h2>
          <button type="button" autoFocus onClick={() => dialog.current.close()}>
            关闭 ×
          </button>
        </div>
        <p>{evidence.note}</p>
        <img src={evidence.image} alt={evidence.title} />
        <ExternalLink href={evidence.image}>新窗口查看原图</ExternalLink>
      </dialog>
    </main>
  )
}
