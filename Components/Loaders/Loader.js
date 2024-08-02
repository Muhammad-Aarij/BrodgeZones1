import React from 'react'
import LoaderKit from 'react-native-loader-kit'

export default function Loader() {
    return (
        <LoaderKit
            style={{ width: 60, height: 60 }}
            name={'BallGridPulse'}
            color={'#4BAAC8'}
        />
    )
}