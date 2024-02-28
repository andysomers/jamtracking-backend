<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Team;
use App\Factory\TeamFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class TeamsTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        TeamFactory::createMany(100);

        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/teams');

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/Team',
            '@id' => '/teams',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 100,
            'hydra:view' => [
                '@id' => '/teams?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/teams?page=1',
                'hydra:last' => '/teams?page=4',
                'hydra:next' => '/teams?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Team::class);
    }

    public function testCreateTeam(): void
    {
        $response = static::createClient()->request('POST', '/teams', ['json' => [
            'name' => 'Antwerp Roller Derby',
            'color' => 'pink',
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Team',
            '@type' => 'Team',
            'name' => 'Antwerp Roller Derby',
            'color' => 'pink',
            'skaters' => [],
        ]);
        $this->assertMatchesRegularExpression('~^/teams/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Team::class);
    }

    public function testCreateInvalidTeam(): void
    {
        static::createClient()->request('POST', '/teams', ['json' => [
            'color' => 'invalid',
        ]]);

        $this->assertResponseStatusCodeSame(422);
        //$this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    public function testUpdateTeam(): void
    {
        // Only create the team we need with a given name
        TeamFactory::createOne(['name' => 'Test Roller Derby']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Team::class, ['name' => 'Test Roller Derby']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'name' => 'updated name',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => 'updated name',
        ]);
    }

    public function testDeleteTeam(): void
    {
        TeamFactory::createOne(['name' => 'Test Roller Derby']);

        $client = static::createClient();
        $iri = $this->findIriBy(Team::class, ['name' => 'Test Roller Derby']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
        // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Team::class)->findOneBy(['name' => 'Test Roller Derby'])
        );
    }

}
