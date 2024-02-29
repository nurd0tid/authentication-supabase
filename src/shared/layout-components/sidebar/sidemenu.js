export const MENUITEMS = [
    {
        menutitle: "MAIN",
        Items: [
            { path: `/components/dashboard/dashboard`, icon: 'fe fe-home', type: 'link', active: false, selected: false, title: 'Dashboard' },
        ]
    },
    {
        menutitle: "UI KIT",

        Items: [

            {
                title: 'Apps', icon: "fe fe-slack", type: 'sub', active: false, selected: false, children: [

                    { path: `/components/apps/widgets`, type: 'link', active: false, selected: false, title: 'Widgets' }

                ]
            },
        ]
    },
    
];
