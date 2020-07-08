export default [
    {
        name: "BASF",
        isin: "DE000BASF111"
    },
    {
        name: "Adidas",
        isin: "DE000A1EWWW0"
    },
    {
        name: "Private Assets AG",
        isin: "DE0006051139"
    },
    {
        name: "Apple",
        isin: "US0378331005"
    },
    {
        name: "Tesla",
        isin: "US88160R1014"
    },
    {
        name: "Microsoft",
        isin: "US5949181045"
    }
].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
})