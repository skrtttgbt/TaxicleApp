export const getUserLocation = async(): Promise<[number,number]> => {

    return new Promise( (resolve, reject)  => {

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                resolve([ coords.longitude, coords.latitude])
            },
            ( err ) => {
                alert ("could not get geolocation");
                console.log(err);
                reject();
            }
        )

    });
}

