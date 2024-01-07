export const arcsiBaseURL = 'https://arcsi.lahmacun.hu/arcsi'
export const arcsiShowsBaseURL = arcsiBaseURL + '/show'
//arcsiServerURL is legacy, currently not in use as it returns all items along with the shows
export const arcsiServerURL = arcsiBaseURL + '/show/all'
export const arcsiItemBaseURL = arcsiBaseURL + '/item'

export const config = {
headers: {
        'Authentication-Token': 'your-token'
    }
  };

// dev server 'https://devarcsi.lahmacun.hu' //
// prod server 'https://arcsi.lahmacun.hu' //
// local server 'http://docker.for.mac.localhost:40'; //
// local server 'http://localhost:40'; //
// local server 'http://docker.for.mac.localhost:40'; //

// export const mediaServerURL = 'https://media.lahmacun.hu/'
export const mediaServerURL = 'https://media.lahmacun.hu/'

export const streamServer = 'https://streaming.lahmacun.hu/api/nowplaying/1'

export const contentApiURL = 'https://cms.lahmacun.hu/wp-json/wp/v2'
// wp queries
export const newsBaseURL = contentApiURL + '/posts?categories=5'
export const newsURL = contentApiURL + '/posts?categories=5&per_page=12'
export const aboutUsURL = contentApiURL + '/pages/228'
export const impressumURL = contentApiURL + '/pages/3075'
export const favouriteRadiosURL = contentApiURL + '/pages/2875'
export const supportersURL = contentApiURL + '/pages/4648'
export const callForShowsURL = contentApiURL + '/pages/3077'
export const lahmaBaseURL = contentApiURL + '/pages/3079'
export const communitySectionURL = contentApiURL + '/pages/3083'
export const eventsSectionURL = contentApiURL + '/pages/3085'
export const pressSectionURL = contentApiURL + '/pages/3087'
export const labsSectionURL = contentApiURL + '/pages/3091'
export const recipeSectionURL = contentApiURL + '/pages/3093'
export const rareShowsURL = contentApiURL + '/pages/3721'
export const bannerTextURL = contentApiURL + '/pages/3932'
export const cookiesPageURL = contentApiURL + '/pages/3923'
export const donateBannerURL = contentApiURL + '/pages/4291'

export const lahmaGaleriesURL = contentApiURL + '/lahma_gallery'
export const mediaURL = contentApiURL + '/media'
export const tagsURL = contentApiURL + '/tags'

export const customScheduleURL = contentApiURL + '/pages/3679'

export const donateURL = contentApiURL + '/pages/2'
export const membershipURL = contentApiURL + '/pages/1425'

export const membershipStripeURL = contentApiURL + '/pages/4980'
export const membershipStripeCancelURL = contentApiURL + '/pages/4992'
export const membershipStripeThanksURL = contentApiURL + '/pages/4994'

export const donateStripeURL = contentApiURL + '/pages/5088'
export const donateStripeCancelURL = contentApiURL + '/pages/5090'
export const donateStripeThanksURL = contentApiURL + '/pages/5092'
