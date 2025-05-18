import { Color } from "../Vigilance";
import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @SliderProperty,
    @Vigilant,
} from 'Vigilance';



@Vigilant('CoresModulePrivate', 'CoresModulePrivate', {
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ['General', 'Tracker'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    // getSubcategoryComparator: () => (a, b) => {
    //     // These function examples will sort the subcategories by the order in the array, so eeeeeee
    //     // will be above Category.
    //     const subcategories = ['Burrows', 'Tracker', 'Waypoints', 'Loot Announcer', 'Bobber Counter', 'Other', 'Party Commands'];

    //     return subcategories.indexOf(a.name) - subcategories.indexOf(b.name);
    // },
    // getPropertyComparator: () => (a, b) => {
    //     // And this will put the properties in the order we want them to appear.
    //     const names = ["Do action!!!", "password", "text", "Color Picker"];

    //     return names.indexOf(a.attributesExt.name) - names.indexOf(b.attributesExt.name);
    // }
})

class cmSettingsData {
    constructor() {
        this.initialize(this);
        // this.addDependency("TheNameOfTheThingYouWannaAddDependencyTo", "TheNameOfTheDependency");

    }
    // ----- General Settings -----

    @SwitchProperty({
        name: "Enable Cores Module",
        description: "Enable or disable the module",
        category: "General",
        subcategory: "Settings",
    })
    enabled = true;

    // ----- Tracker Settings -----

    @SliderProperty({
        name: "Line Width",
        description: "The line width for &a/trackPlayer playerName",
        category: "Tracker",
        subcategory: "Settings",
        min: 0,
        max: 10,
        step: 1
    })
    lineWidth = 4;

    @SwitchProperty({
        name: "Waipoint Tracer",
        description: "Add a waypoint on the player loc",
        category: "Tracker",
        subcategory: "Settings",
    })
    wpTrue = false;
    @ColorProperty({
        name: "Waipoint Tracer Color",
        description: "Choose the color for the waypoint tracer (default is ffffffff)",
        category: "Tracker",
        subcategory: "Settings",
    })
    wpColor = new Color(1, 1, 1, 1);

    @ColorProperty({
        name: "Line Color",
        description: "The color of the line for &a/trackPlayer playerName (default is 00ffffff)",
        category: "Tracker",
        subcategory: "Settings",
    })
    lineColor = new Color(0, 1, 1, 1);
}

export default new cmSettingsData();
