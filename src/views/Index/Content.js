import React, { useEffect, useState } from 'react';
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import Progress from "./Progress"
import { createProduct as CreateProduct } from '../../graphql/mutations'
import { listProducts as ListProducts } from '../../graphql/queries'
import config from '../../aws-exports'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

function Content() {

  const [file, updateFile] = useState(null)
  const [productName, updateProductName] = useState('')
  const [products, updateProducts] = useState([])
  const [pgress, updatePgress] = useState(0)
  useEffect(() => {
    listProducts()
  }, [])

  // Query the API and save them to the state
  async function listProducts() {
    const products = await API.graphql(graphqlOperation(ListProducts))
    updateProducts(products.data.listProducts.items)
  }

  function handleChange(event) {
    const { target: { value, files } } = event
    const fileForUpload = files[0]
    updateProductName(fileForUpload.name.split(".")[0])
    updateFile(fileForUpload || value)
  }

  // upload the image to S3 and then save it in the GraphQL API
  async function createProduct() {
    if (file) {
      const extension = file.name.split(".")[1]
      const { type: mimeType } = file
      const key = `images/${uuid()}${productName}.${extension}`
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      const inputData = { name: productName, image: url }

      try {
        await Storage.put(key, file, {
          contentType: mimeType,
          progressCallback: progress => {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
            const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
            updatePgress(percentUploaded);
          }
        })
        await API.graphql(graphqlOperation(CreateProduct, { input: inputData }))
        const products = await API.graphql(graphqlOperation(ListProducts))
        updateProducts(products.data.listProducts.items)
      } catch (err) {
        console.log('error: ', err)
      }
    }
  }

  return (
    <div style={styles.container}>

      <input
        type="file"
        onChange={handleChange}
        style={{ margin: '10px 0px' }}
      />
      <input
        placeholder='File Name'
        value={productName}
        onChange={e => updateProductName(e.target.value)}
      />
      <button
        style={styles.button}
        onClick={createProduct}>Upload</button>

      {(pgress > 0 && pgress < 100) && (
        <Progress
          className="progress"
          percentage={pgress}
          progressColor='blue'
          textColor='white'
        />
      )}

      { pgress === 100 && (
        <p>Upload completed</p>
      )}


      <h5>Already uploaded files</h5>
      {
        products.map((p, i) => (
          <p key={p.name + i}>{p.name}</p>
        ))
      }
    </div>
  );
}

const styles = {
  container: {
    width: 400,
    margin: '0 auto'
  },
  image: {
    width: 400
  },
  button: {
    width: 200,
    backgroundColor: '#ddd',
    cursor: 'pointer',
    height: 30,
    margin: '0px 0px 8px'
  }
}

export default Content;