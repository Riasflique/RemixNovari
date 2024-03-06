# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`


## Backend endpoints

Adapter controller:

    public AdapterController(PortalApiService portalApiService, AdapterService adapterService) {
        this.portalApiService = portalApiService;
        this.adapterService = adapterService;
    }

    @Operation(summary = "Add adapter")
    @RequestMapping(
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Adapter> addAdapter(@PathVariable("orgName") final String orgName,
                                              @RequestBody final Adapter adapter) {

        Organisation organisation = portalApiService.getOrganisation(orgName);

        Optional<Adapter> optionalAdapter = adapterService.getAdapter(adapter.getName(), orgName);
        if (!optionalAdapter.isPresent()) {
            if (adapterService.addAdapter(adapter, organisation)) {
                //return ResponseEntity.ok().body(adapter);
                return ResponseEntity.status(HttpStatus.CREATED).cacheControl(CacheControl.noStore()).body(adapter);
            }
        }

        throw new EntityFoundException(
                ServletUriComponentsBuilder
                        .fromCurrentRequest().path("/{name}")
                        .buildAndExpand(adapter.getName()).toUri().toString()
        );

    }

    @Operation(summary = "Update adapter")
    @RequestMapping(method = RequestMethod.PUT,
            value = "/{adapterName}"
    )
    public ResponseEntity<Adapter> updateAdapter(@PathVariable final String orgName,
                                                 @PathVariable final String adapterName,
                                                 @RequestBody final Adapter adapter) {

        Organisation organisation = portalApiService.getOrganisation(orgName);
        Adapter original = portalApiService.getAdapter(organisation, adapterName);

        if (!adapterName.equals(adapter.getName())) {
            throw new UpdateEntityMismatchException(
                    String.format("Adapter requested for update (%s) is not the same adapter in endpoint (%s).",
                            adapter.getName(),
                            adapterName)
            );
        }

        if (adapter.getNote() != null)
            original.setNote(adapter.getNote());
        if (adapter.getShortDescription() != null)
            original.setShortDescription(adapter.getShortDescription());

        if (!adapterService.updateAdapter(original)) {
            throw new EntityNotFoundException(String.format("Could not update adapter: %s", adapterName));
        }

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(original);

    }

    @Operation(summary = "Reset adapter password")
    @RequestMapping(method = RequestMethod.PUT,
            value = "/{adapterName}/password",
            consumes = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<Adapter> resetAdapterPassword(@PathVariable final String orgName,
                                                        @PathVariable final String adapterName,
                                                        @RequestBody String newPassword) {

        Organisation organisation = portalApiService.getOrganisation(orgName);

        Adapter adapter = portalApiService.getAdapter(organisation, adapterName);
        adapterService.resetAdapterPassword(adapter, newPassword);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(adapter);
    }

    @Operation(summary = "Get all adapters")
    @RequestMapping(
            method = RequestMethod.GET
    )
    public ResponseEntity<List<Adapter>> getAllAdapters(@PathVariable("orgName") final String orgName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);

        List<Adapter> adapters = portalApiService.getAdapters(organisation);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(adapters);
    }

    @Operation(summary = "Get adapter")
    @RequestMapping(
            method = RequestMethod.GET,
            value = "/{adapterName}"
    )
    public ResponseEntity<Adapter> getAdapter(@PathVariable("orgName") final String orgName,
                                              @PathVariable final String adapterName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);

        Adapter adapter = portalApiService.getAdapter(organisation, adapterName);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(adapter);
    }

    @Operation(summary = "Get Adapter OpenID Secret")
    @RequestMapping(
            method = RequestMethod.GET,
            value = "/{adapterName}/secret"
    )
    public ResponseEntity<String> getAdapterSecret(@PathVariable("orgName") final String orgName,
                                                   @PathVariable final String adapterName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Adapter adapter = portalApiService.getAdapter(organisation, adapterName);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(adapterService.getAdapterSecret(adapter));
    }

    @Operation(summary = "Delete adapter")
    @RequestMapping(method = RequestMethod.DELETE,
            value = "/{adapterName}"
    )
    public ResponseEntity<Void> deleteAdapter(@PathVariable("orgName") final String orgName,
                                              @PathVariable final String adapterName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Adapter adapter = portalApiService.getAdapter(organisation, adapterName);

        adapterService.deleteAdapter(adapter);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }


    //
    // Exception handlers
    //
    @ExceptionHandler(UpdateEntityMismatchException.class)
    public ResponseEntity<ErrorResponse> handleUpdateEntityMismatch(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityFound(Exception e) {
        return ResponseEntity.status(HttpStatus.FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(NameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNameNotFound(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(UnknownHostException.class)
    public ResponseEntity<ErrorResponse> handleUnkownHost(Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(e.getMessage()));
    }

Client controller:

    @Operation(summary = "Add client")
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Client> addClient(@PathVariable("orgName") final String orgName,
                                            @RequestBody final Client client) {

        Organisation organisation = portalApiService.getOrganisation(orgName);
        Optional<Client> optionalClient = clientService.getClient(client.getName(), orgName);


        if (optionalClient.isEmpty()) {
            if (clientService.addClient(client, organisation)) {
                return ResponseEntity.status(HttpStatus.CREATED).cacheControl(CacheControl.noStore()).body(client);

            }
        }

        throw new EntityFoundException(
                ServletUriComponentsBuilder
                        .fromCurrentRequest().path("/{name}")
                        .buildAndExpand(client.getName()).toUri().toString()
        );
    }

    @Operation(summary = "Update client")
    @RequestMapping(method = RequestMethod.PUT,
            value = "/{clientName}"
    )
    public ResponseEntity<Client> updateClient(@PathVariable("orgName") final String orgName,
                                               @PathVariable final String clientName,
                                               @RequestBody final Client client) {

        Organisation organisation = portalApiService.getOrganisation(orgName);
        Client original = portalApiService.getClient(organisation, clientName);

        if (!clientName.equals(client.getName())) {
            throw new UpdateEntityMismatchException(
                    String.format("Client requested for update (%s) is not the same client in endpoint (%s).",
                            client.getName(),
                            clientName)
            );
        }

        if (client.getNote() != null)
            original.setNote(client.getNote());
        if (client.getShortDescription() != null)
            original.setShortDescription(client.getShortDescription());

        if (!clientService.updateClient(original)) {
            throw new EntityNotFoundException(String.format("Could not update client: %s", clientName));
        }

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(original);
    }


    @Operation(summary = "Reset client password")
    @RequestMapping(method = RequestMethod.PUT,
            value = "/{clientName}/password"
    )
    public ResponseEntity<Client> resetClientPassword(@PathVariable("orgName") final String orgName,
                                                      @PathVariable final String clientName,
                                                      @RequestBody String newPassword) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Client client = portalApiService.getClient(organisation, clientName);

        clientService.resetClientPassword(client, newPassword);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(client);
    }

    @Operation(summary = "Get all clients")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Client>> getAllClients(@PathVariable("orgName") final String orgName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);

        List<Client> list = portalApiService.getClients(organisation);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(list);
    }

    @Operation(summary = "Get client")
    @RequestMapping(method = RequestMethod.GET,
            value = "/{clientName}"
    )
    public ResponseEntity<Client> getClient(@PathVariable("orgName") final String orgName,
                                            @PathVariable final String clientName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Client client = portalApiService.getClient(organisation, clientName);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(client);
    }

    @Operation(summary = "Get Client OpenID Secret")
    @RequestMapping(
            method = RequestMethod.GET,
            value = "/{clientName}/secret"
    )
    public ResponseEntity<String> getClientSecret(@PathVariable("orgName") final String orgName,
                                                  @PathVariable final String clientName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Client client = portalApiService.getClient(organisation, clientName);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(clientService.getClientSecret(client));
    }


    @Operation(summary = "Delete client")
    @RequestMapping(method = RequestMethod.DELETE,
            value = "/{clientName}"
    )
    public ResponseEntity<Void> deleteClient(@PathVariable("orgName") final String orgName,
                                             @PathVariable final String clientName) {
        Organisation organisation = portalApiService.getOrganisation(orgName);
        Client client = portalApiService.getClient(organisation, clientName);

        clientService.deleteClient(client);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }


    //
    // Exception handlers
    //
    @ExceptionHandler(UpdateEntityMismatchException.class)
    public ResponseEntity<ErrorResponse> handleUpdateEntityMismatch(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityFound(Exception e) {
        return ResponseEntity.status(HttpStatus.FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(NameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNameNotFound(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(UnknownHostException.class)
    public ResponseEntity<ErrorResponse> handleUnkownHost(Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(e.getMessage()));
    }