<div align="center">
  
  <img src="https://res.cloudinary.com/ix-48/image/upload/v1594108320/logo-wide-light.svg" />

  <br/>
  <div style="color: #808080; font-style:italic;">
    <h3>
      WORKER: IXF
    </h3>
  </div>

</div>

<hr/>

This repository contains code used for automatically generating [Euro-IX/IXDB-compliant](https://ixpdb.euro-ix.net/) participant data.

## How it Works

Upon execution, the [Cloudflare](https://workers.cloudflare.com/) worker pulls data from the 48 IX participant database such as the participant name, ASN, and port speed. Taking the ASN, the worker queries the [PeeringDB](https://peeringdb.com) REST API for additional information about a participant, such as their peering policy, contacts, IRR macro, etc. All the data is combined into an [IXDB-compliant](https://github.com/euro-ix/json-schemas/blob/master/versions/ixp-member-list-1.0.schema.json) schema for easy processing by IXDB and anyone else seeking to consume the data in the IXDB format.

The data is cached by Cloudflare for 12 hours. Upon a cache-miss, the data is re-pulled and re-cached for another 12 hours.

## Publishing

To publish a build from [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler):

```bash
wrangler publish -c prod.wrangler.toml
```

## Development

Development environments require a local `dev.wrangler.toml` file which contains sensitive environment variables. After installing the [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler), run:

```bash
cd ixf
yarn
wrangler dev -c dev.wrangler.toml
```

## Contributing

48 IX Participants may feel free to submit pull requests under the following circumstances:

- A verified bug is being fixed
- A feature is being added which maintains the 48 IX Connection Agreement and benefits all participants
- Performance is improved

If you would like to contribute, please [email the NOC](mailto:noc@48ix.net) to discuss code quality standards and development processes.
