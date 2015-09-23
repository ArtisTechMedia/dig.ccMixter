export default {
    app: {
        pageTitle: 'Free Music For Film and Video Makers',
    },
    queryOptions: {
            instrumental: 'instrumentals only',
            limit: 'results',
            recent: 'recent',
            deep: 'dig deep',
            reset: 'reset',
            matchAnyTags: 'match any tags',
            licenses: {
                all: 'all',
                free: 'free',
                ccplus: 'licensed',
                },
        },
    navbar: {
        searchPlaceHolder: "genre, instrument, etc.",
        options: 'options',
        links: {
            film: 'music for film',
            games: 'music for games',
            how: 'how it works',
            free: 'free for commercial use',
            ccplus: 'royalty free licensed',
            licenses: 'licenses',
        },
    },
    dlPopup: {
        freeToUse: "Free to use in commercial projects.",
        forNonComm: "For non commercial projects only.",
        toUseThisMusic: "To use this music you are <mark>required</mark> to give credit to the musicians.",
        download:  "Download",
        buyALicense1: "Buy a License",
        buyALicense2: 'to remove these restrictions',
        plainText: 'Plain Text',
        HTML: 'HTML',
        downloadButtonText: "Download",
        licenseTextPlain: "\"{{songTitle}}\" by {{artistName}} (c) {{year}} Licensed under a Creative Commons {{licenseName}} license. {{filePageURL}}",
        licenseTextHTML: "<div class=\"attribution-block\">\"<a href=\"{{filePageURL}}\">{{songTitle}}</a>\" by {{artistName}} (c) {{year}} Licensed under a Creative Commons <a href=\" {{licenseURL}}\">{{licenseName}}</a> license.</div>",
        copyToClip: 'Copy to clipboard',
        featuring: 'Ft: {{ft}} ',
        featuringHTML: '<div class=\"attribution-ft-block\"> Ft: {{ft}} </div>',
        close: 'Close',
        credit: "What happens if I don't give credit?",
        answer: "You are in violation of copyright!!! Not. Cool.",
    },
    tbPopup: {
        trackback: 'Trackback',
        title: '{{name}} <span>by</span> {{artist}}',
        featuring: '<span>Includes</span> {{name}} <span>by</span> {{artist}}',
        original: 'Original',
        close: 'Close'
    },
    tbForm: {
       title: '<span>Submit a Trackback for</span> {{name}}',
       yourName: 'Your Name',
       tellUs: 'let us know who you are',
       youEmail: 'Your email',
       weMayCon: 'We may contact you here',
       URL: 'Web Address',
       exURL: 'http://website/with/media',
       artist: 'Artist Name',
       medType: 'Media type',
       whoMade: 'Who made the video/podcast/etc?',
       types: {
            video: 'Video',
            podcast: 'Podcast',
            album: 'Album',
            website: 'Web site',
            soundcloud: 'SoundCloud (tm)',
            },
       embed: 'Embed code',
       submit: 'submit',
       cancel: 'cancel',
       submitting: 'Submitting to ccMixter...',
       missingFields: 'You must fill in your email address and the link to the trackback.',
       success: 'Your trackback has been submitted. it will appear after it has been approved.',
       wups: "Wups. Something didn't work quite right.",
       errorInForm: 'Wups',
       
    },
    pagination: {
        prev: "← Previous",
        next: "Next →",
    },
    upload: {
        moreBy: "More by {{artist}}",
        moreLikeThis: 'More like this',
        trackbacks: 'Trackback Projects',
        remixes: 'Remixed at ccMixter',
        addTrackback: 'Add',
        noRemixes: '(no remixes yet!)',
        noTrackbacks: '(no trackbacks yet - add one!)',
        featuring: 'Featuring',
        tooManyTBs: 'Too many to show you here!',
        pageTitle: '{{name}} by {{artist}}',
    },
    share: {
        share: 'Share',
        fb: "Share to Facebook",
        twitter: "Share to Twitter",
        email: 'Share via e-Mail',
        subject: "Dig the sounds at Dig",
        body: "I'm sharing some sounds I found at dig.ccmixter: "
    },
    morelike: {
        title: 'More like',
    },
    dig: {
        titleWithStr: 'Search Results',
        title: 'Dig the Music',
        didU: 'Did You Mean...',
        genre: 'Genres',
        artists: 'Artists',
        notFound: "Not what you're looking for?",
    },
    free: {
        title: "Music Free for Commercial Use",
    },
    ccplus: {
        title: "Music Available for Royalty-Free License",
    },
    
    instrumental: "Instrumental",
    
    games: {
        title: "Music for Video Games",
    },
    
    video: {
        title: "Music for Film and Video",
    },
    
    licenses: {
        title: "Our Licenses Overview",
        by: "Free to use, even in commercial projects " +
             "<strong>but</strong> you must give credit to the musicians.",
        'by-nc': "Free to use only in non-commercial projects. Again, " +
              "you must give credit to the musicians.",
        ccplus: "Available without any restrictions for a " +
                "sliding scale, royalty free fee.",
        example: 'Example',
        linkToLic: 'Full CC license',
    },
    nowPlaying: {
        title: 'Now Playing',
    },
    audioPlayer: {
        playlist: 'playlist',
    },
    tags: {
        categories: {
            instr: 'Instruments',
            genre: 'Genres',
            mood: 'Mood'
            },
        clear: 'clear',
        subTitle: 'tagged with',
        match: 'match any tag',
    },
    playlist: {
        noMatches: 'Hrumph. No matches for your search.',
        tryReset: 'Trying resetting your options: ',
        loading: 'Hold on... ',
    },
    query: {
        loadingOptions: 'Getting options...',
    },
    user: {
        homepage: 'home page',
    },
    homepage: {
        mainHeading: 'You Already{{{break}}} Have Permission',
        subHeading: 'The music discovery site used in{{{break}}} over 1 million videos and games',
        howItWorks: 'How it Works',
        musicians: 'Musicians upload to',
        urHere: 'You<br >are<br >here!',
        findMusic: 'You find music at',
        project: 'You put it into your project',
        instrHead: 'Instrumental Music for Film & Video',
        instrSub: 'Find that perfect soundtrack or theme music for your film or video project.',
        freeHead: 'Free Music for Commerical Projects',
        freeSub: 'Thousands of hours of free music - all you have to do is give credit to the musicians.',
        gamesHead: 'Music for Video Games',
        gamesSub: 'Eclectic, eccentric, experimental genres for themes and looping backgrounds',
        more: 'Dig!',
    },
    footer: {
        here: 'Here',
        resources: 'Resources',        
        there: 'There',
        contactLink: 'Contact',
        freeLink: 'Free Music',
        ccPlusLink: 'Licensed Music',
        privacy: 'Privacy',
        terms: 'Terms of Use',
        social: 'Everywhere',
        forums: 'Forums',
        licenses: 'About Our Licenses',
        whoweare: 'Who We R',
        donate: 'Donate (!)',
        
    },
    wups: {
        title: 'Wups',
        text: "Hey... for some anti-magical reason we can't show you this remix!"
    }
    
};
