const CONTENTFUL_API = 'https://cdn.contentful.com/spaces';

/**
 * Get the participant list from Contentful, which serves as 48 IX's current "source of truth".
 */
export async function* getParticipants(): AsyncGenerator<ParticipantEntry, any, any> {
  const res = await fetch(
    `${CONTENTFUL_API}/${CONTENTFUL_SPACE}/entries?access_token=${CONTENTFUL_TOKEN}&content_type=participants`,
  );
  const resJson: ContentfulResponse = await res.json();
  if (resJson.total !== 0) {
    for await (let p of resJson.includes.Entry) {
      yield p.fields;
    }
  }
}
