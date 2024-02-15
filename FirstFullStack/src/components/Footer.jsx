import React from 'react'
import { Footer } from 'flowbite-react'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

function FooterComp() {
  return (
    <Footer container className='border border-t-8 border-orange-400 pl-6 pr-16 '>
        <div className='flex flex-col w-full sm:gap-0 gap-5'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-3xl font-bold '>AniMangRe</h3>
                </div>
                <div className='flex gap-5'>
                    <Footer.LinkGroup className='text-md cursor-pointer'>
                        <Footer.Link> Github </Footer.Link>
                        <Footer.Link> Discord </Footer.Link>
                        <Footer.Link> About </Footer.Link>
                    </Footer.LinkGroup>
                    
                </div>
            </div>
            <Footer.Divider />
            <div className='flex justify-between sm:flex-row flex-col sm:gap-0 gap-3'>
                <div>
                <Footer.Copyright href="#" by="AniMangRe" year={2024} />
                </div>
                <div className='flex gap-5'>
                    <Footer.Icon href="#" icon={BsFacebook} />
                    <Footer.Icon href="#" icon={BsInstagram} />
                    <Footer.Icon href="#" icon={BsTwitter} />
                    <Footer.Icon href="#" icon={BsGithub} />
                    <Footer.Icon href="#" icon={BsDribbble} />
                </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterComp
