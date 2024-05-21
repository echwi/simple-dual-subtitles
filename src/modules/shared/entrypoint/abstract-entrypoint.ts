export abstract class AbstractEntrypoint {
    protected async initProperty(PropertyClass) {
        const propertyInstance = new PropertyClass();
        await propertyInstance.init();
        return propertyInstance;
    }
}